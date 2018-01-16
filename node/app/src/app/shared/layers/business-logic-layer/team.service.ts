import {Injectable} from '@angular/core';
import {Person} from '../../models/person';
import {Team} from '../../models/team';
import * as FileSaver from 'file-saver';
import {CSVPersonDataAccessService} from '../data-access-layer/csv-person-data-access.service';

@Injectable()
export class TeamService {
  private readonly EXPORT_DATA_TYPE = 'text/csv;charset=utf-8';
  private readonly EXPORT_FILE_NAME = 'TEASE-Project.csv';

  teams: Team[];
  persons: Person[];

  // derived properties
  personsWithoutTeam: Person[];

  private load(data: [Person[], Team[]]) {
    [this.persons, this.teams] = data;
    this.updateDerivedProperties();
  }

  public updateDerivedProperties() {
    this.personsWithoutTeam = this.persons.filter(person => person.team === null);
  }

  public updateReverseReferences() {
    this.teams.forEach(team => team.persons.forEach(person => person.team = team));
    this.personsWithoutTeam.forEach(person => person.team = null);
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
    this.persons.forEach(person => person.isPinned = false);
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

  public exportSavedState() {
    const csvData = CSVPersonDataAccessService.getSavedDataFromBrowserStorage();
    const blob = new Blob([csvData], {type: this.EXPORT_DATA_TYPE});
    FileSaver.saveAs(blob, this.EXPORT_FILE_NAME);
  }

  public saveToLocalBrowserStorage(): Promise<boolean> {
    console.log('saving...');

    return new Promise((resolve, reject) => {
      this.updateReverseReferences();
      CSVPersonDataAccessService.saveToBrowserStorage(this.persons).then(success => {
        console.log('done');
        resolve(success);
      });
    });
  }

  public clearSavedData() {
    CSVPersonDataAccessService.clearSavedData();
  }

  resetUnpinnedPersons() {
    this.teams.forEach(team => {
      const personsToRemove = team.persons.filter(person => !person.isPinned);
      team.persons = team.persons.filter(person => person.isPinned);
      personsToRemove.forEach(person => person.team = null);
      this.personsWithoutTeam.push(...personsToRemove);
    });
  }
}
