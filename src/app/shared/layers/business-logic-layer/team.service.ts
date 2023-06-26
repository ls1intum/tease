import { Injectable } from '@angular/core';
import { Student } from '../../models/student';
import { Team } from '../../models/team';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { CSVStudentDataAccessService } from '../data-access-layer/csv-student-data-access.service';
import { ConstraintLoggingService } from './constraint-logging.service';

@Injectable()
export class TeamService {
  private readonly EXPORT_DATA_TYPE = 'text/csv;charset=utf-8';
  private readonly EXPORT_FILE_NAME = 'TEASE-export.zip';
  private readonly LOG_EXPORT_FILE_NAME = 'constraint-distribution-log.txt';
  private readonly CSV_EXPORT_FILE_NAME = 'TEASE-project.csv';

  teams: Team[];
  students: Student[];

  // derived properties
  studentsWithoutTeam: Student[];

  private load(data: [Student[], Team[]]) {
    [this.students, this.teams] = data;
    this.updateDerivedProperties();
  }

  public getTeamByName(teamName: string): Team {
    return this.teams.find(team => team.name === teamName) // assumes multiple teams do not exist with the same name
  }

  public getStudentById(studentId: string): Student {
    return this.students.find(student => student.studentId == studentId) // assumes multiple people do not exist with same student id
  }

  public updateDerivedProperties() {
    this.studentsWithoutTeam = this.students.filter(student => student.team === null);
  }

  public updateReverseReferences() {
    this.teams.forEach(team => team.students.forEach(student => (student.team = team)));
    this.studentsWithoutTeam.forEach(student => (student.team = null));
    this.updateDerivedProperties();
  }

  public sortStudents() {
    const compareFunction = (studentA, studentB) => studentB.supervisorRating - studentA.supervisorRating;

    this.teams.forEach(team => team.students.sort(compareFunction));
    this.students.sort(compareFunction);
    this.updateDerivedProperties();
  }

  // removes all students from their team
  public resetTeamAllocation() {
    this.teams.forEach(team => team.clear());
    this.updateDerivedProperties();
  }

  public resetPinnedStatus() {
    this.students.forEach(student => (student.isPinned = false));
  }

  public readFromBrowserStorage(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      CSVStudentDataAccessService.readDataFromBrowserStorage().then(data => {
        this.load(data);
        resolve(true);
      });
    });
  }

  public readFromCSVFile(csvFile: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      CSVStudentDataAccessService.readFromFile(csvFile).then(data => {
        this.load(data);
        this.saveToLocalBrowserStorage().then(saveSuccess => {
          this.readFromBrowserStorage().then(readSuccess => {
            resolve(true);
          });
        });
      });
    });
  }

  public readRemoteData(remoteFilePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      CSVStudentDataAccessService.readFromRemote(remoteFilePath).then(data => {
        this.load(data);
        resolve(true);
      });
    });
  }

  public exportSavedState() {
    const csvData = CSVStudentDataAccessService.getSavedDataFromBrowserStorage();
    const blob = new Blob([csvData], { type: this.EXPORT_DATA_TYPE });

    const zip = new JSZip();
    zip.file(this.LOG_EXPORT_FILE_NAME, ConstraintLoggingService.getLog());
    zip.file(this.CSV_EXPORT_FILE_NAME, blob);

    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, this.EXPORT_FILE_NAME);
    });
  }

  public saveToLocalBrowserStorage(): Promise<boolean> {
    console.log('saving...');

    return new Promise((resolve, reject) => {
      this.updateReverseReferences();
      CSVStudentDataAccessService.saveToBrowserStorage(this.students).then(success => {
        console.log('done');
        resolve(success);
      });
    });
  }

  public clearSavedData() {
    CSVStudentDataAccessService.clearSavedData();
  }

  resetUnpinnedStudents() {
    this.teams.forEach(team => {
      const studentsToRemove = team.students.filter(student => !student.isPinned);
      team.students = team.students.filter(student => student.isPinned);
      studentsToRemove.forEach(student => (student.team = null));
      this.studentsWithoutTeam.push(...studentsToRemove);
    });
  }
}
