import { Person } from '../../models/person';
import { Team } from '../../models/team';
import * as Papa from 'papaparse';
import { PersonSerializer } from './PersonSerializer';
import { PersonParser } from './PersonParser';

export class CSVPersonDataAccessService {
  private static readonly BrowserStorageKey = 'TEASE-person-data';

  static readDataFromBrowserStorage(): Promise<[Person[], Team[]]> {
    const teamData = localStorage.getItem(CSVPersonDataAccessService.BrowserStorageKey);

    if (teamData === undefined || teamData === null) {
      return Promise.resolve([[], []]);
    }

    return new Promise((resolve, reject) => {
      Papa.parse(teamData, {
        complete: results => {
          const [persons, teams] = PersonParser.parsePersons(results.data);
          this.sortTeams(teams);
          resolve([persons, teams]);
        },
        header: true,
      });
    });
  }

  public static getSavedDataFromBrowserStorage(): string {
    return localStorage.getItem(CSVPersonDataAccessService.BrowserStorageKey);
  }

  public static readFromFile(csvFile: File): Promise<[Person[], Team[]]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        complete: results => {
          const [persons, teams] = PersonParser.parsePersons(results.data);
          this.sortTeams(teams);
          resolve([persons, teams]);
        },
        header: true,
      });
    });
  }

  public static readFromRemote(remoteFilePath: string): Promise<[Person[], Team[]]> {
    return new Promise((resolve, reject) => {
      Papa.parse(remoteFilePath, {
        download: true,
        complete: results => {
          const [persons, teams] = PersonParser.parsePersons(results.data);
          this.sortTeams(teams);
          console.log('CSVPersonDataAccessService:', persons, teams);
          resolve([persons, teams]);
        },
        header: true,
      });
    });
  }

  private static sortTeams(teams: Team[]) {
    teams.sort((teamA, teamB) => {
      if (teamA.name.toLowerCase() < teamB.name.toLowerCase()) return -1;
      if (teamA.name.toLowerCase() > teamB.name.toLowerCase()) return 1;
      return 0;
    });
  }

  public static saveToBrowserStorage(persons: Person[]): Promise<boolean> {
    const personPropertyLists = persons.map(person => PersonSerializer.serializePerson(person));
    const result = Papa.unparse(personPropertyLists);
    localStorage.setItem(CSVPersonDataAccessService.BrowserStorageKey, result);
    return Promise.resolve(true);
  }

  public static clearSavedData() {
    localStorage.removeItem(CSVPersonDataAccessService.BrowserStorageKey);
  }
}
