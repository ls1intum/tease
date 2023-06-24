import { Student } from '../../models/student';
import { Project } from '../../models/project';
import * as Papa from 'papaparse';
import { PersonSerializer } from './PersonSerializer';
import { PersonParser } from './PersonParser';

export class CSVPersonDataAccessService {
  private static readonly BrowserStorageKey = 'TEASE-person-data';

  static readDataFromBrowserStorage(): Promise<[Student[], Project[]]> {
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

  public static readFromFile(csvFile: File): Promise<[Student[], Project[]]> {
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

  public static readFromRemote(remoteFilePath: string): Promise<[Student[], Project[]]> {
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

  private static sortTeams(teams: Project[]) {
    teams.sort((teamA, teamB) => {
      if (teamA.name.toLowerCase() < teamB.name.toLowerCase()) return -1;
      if (teamA.name.toLowerCase() > teamB.name.toLowerCase()) return 1;
      return 0;
    });
  }

  public static saveToBrowserStorage(persons: Student[]): Promise<boolean> {
    const personPropertyLists = persons.map(person => PersonSerializer.serializePerson(person));
    const result = Papa.unparse(personPropertyLists);
    localStorage.setItem(CSVPersonDataAccessService.BrowserStorageKey, result);
    return Promise.resolve(true);
  }

  public static clearSavedData() {
    localStorage.removeItem(CSVPersonDataAccessService.BrowserStorageKey);
  }
}
