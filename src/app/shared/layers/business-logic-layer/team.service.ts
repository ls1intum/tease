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
  persons: Student[];

  // derived properties
  personsWithoutTeam: Student[];

  private load(data: [Student[], Team[]]) {
    [this.persons, this.teams] = data;
    this.updateDerivedProperties();
  }

  public getTeamByName(teamName: string): Team {
    return this.teams.find(team => team.name === teamName) // assumes multiple teams do not exist with the same name
  }

  public getPersonById(studentId: string): Student {
    return this.persons.find(person => person.studentId == studentId) // assumes multiple people do not exist with same student id
  }

  public updateDerivedProperties() {
    this.personsWithoutTeam = this.persons.filter(person => person.team === null);
  }

  public updateReverseReferences() {
    this.teams.forEach(team => team.persons.forEach(person => (person.team = team)));
    this.personsWithoutTeam.forEach(person => (person.team = null));
    this.updateDerivedProperties();
  }

  public sortPersons() {
    const compareFunction = (personA, personB) => personB.supervisorRating - personA.supervisorRating;

    this.teams.forEach(team => team.persons.sort(compareFunction));
    this.persons.sort(compareFunction);
    this.updateDerivedProperties();
  }

  // removes all persons from their team
  public resetTeamAllocation() {
    this.teams.forEach(team => team.clear());
    this.updateDerivedProperties();
  }

  public resetPinnedStatus() {
    this.persons.forEach(person => (person.isPinned = false));
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
      CSVStudentDataAccessService.saveToBrowserStorage(this.persons).then(success => {
        console.log('done');
        resolve(success);
      });
    });
  }

  public clearSavedData() {
    CSVStudentDataAccessService.clearSavedData();
  }

  resetUnpinnedPersons() {
    this.teams.forEach(team => {
      const personsToRemove = team.persons.filter(person => !person.isPinned);
      team.persons = team.persons.filter(person => person.isPinned);
      personsToRemove.forEach(person => (person.team = null));
      this.personsWithoutTeam.push(...personsToRemove);
    });
  }
}
