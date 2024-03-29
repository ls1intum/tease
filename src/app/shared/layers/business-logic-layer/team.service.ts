import { Injectable } from '@angular/core';
import { Person } from '../../models/person';
import { Team } from '../../models/team';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { CSVPersonDataAccessService } from '../data-access-layer/csv-person-data-access.service';

@Injectable()
export class TeamService {
  private readonly EXPORT_DATA_TYPE = 'text/csv;charset=utf-8';
  private readonly EXPORT_FILE_NAME = 'TEASE-export.zip';
  private readonly LOG_EXPORT_FILE_NAME = 'constraint-distribution-log.txt';
  private readonly CSV_EXPORT_FILE_NAME = 'TEASE-project.csv';

  teams: Team[];
  persons: Person[];

  // derived properties
  personsWithoutTeam: Person[];

  public load(data: [Person[], Team[]]) {
    [this.persons, this.teams] = data;
    this.updateDerivedProperties();
  }

  public getTeamByName(teamName: string): Team {
    return this.teams.find(team => team.name === teamName); // assumes multiple teams do not exist with the same name
  }

  public getPersonById(tumId: string): Person {
    return this.persons.find(person => person.tumId == tumId); // assumes multiple people do not exist with same TUM id
  }

  public updateDerivedProperties(): void {
    this.personsWithoutTeam = this.persons.filter(person => !person.teamName);
  }

  public sortPersons(): void {
    const compareFunction = (personA, personB) => personB.supervisorRating - personA.supervisorRating;

    this.teams.forEach(team => team.persons.sort(compareFunction));
    this.persons.sort(compareFunction);
    this.updateDerivedProperties();
  }

  // removes all persons from their team
  public resetTeamAllocation(): void {
    this.teams.forEach(team => team.clear());
    this.updateDerivedProperties();
  }

  public resetPinnedStatus() {
    this.persons.forEach(person => (person.isPinned = false));
  }

  public readFromBrowserStorage(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      CSVPersonDataAccessService.readDataFromBrowserStorage().then(data => {
        this.load(data);
        resolve(true);
      });
    });
  }

  public readFromCSVFile(csvFile: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      CSVPersonDataAccessService.readFromFile(csvFile).then(data => {
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
      CSVPersonDataAccessService.readFromRemote(remoteFilePath).then(data => {
        this.load(data);
        resolve(true);
      });
    });
  }

  public exportSavedState(): void {
    const csvData = CSVPersonDataAccessService.getSavedDataFromBrowserStorage();
    const blob = new Blob([csvData], { type: this.EXPORT_DATA_TYPE });

    const zip = new JSZip();
    zip.file(this.CSV_EXPORT_FILE_NAME, blob);

    zip.generateAsync({ type: 'blob' }).then(content => {
      FileSaver.saveAs(content, this.EXPORT_FILE_NAME);
    });
  }

  public saveToLocalBrowserStorage(): Promise<boolean> {
    console.log('saving...');
    return new Promise((resolve, reject) => {
      CSVPersonDataAccessService.saveToBrowserStorage(this.persons).then(success => {
        console.log('done');
        resolve(success);
      });
    });
  }

  public clearSavedData(): void {
    CSVPersonDataAccessService.clearSavedData();
  }

  resetUnpinnedPersons(): void {
    this.teams.forEach(team => {
      const personsToRemove = team.persons.filter(person => !person.isPinned);
      team.persons = team.persons.filter(person => person.isPinned);
      personsToRemove.forEach(person => (person.teamName = null));
      this.personsWithoutTeam.push(...personsToRemove);
    });
  }
}
