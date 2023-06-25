import { Student } from '../../models/student';
import { Team } from '../../models/team';
import * as Papa from 'papaparse';
import { StudentSerializer } from './student-serializer';
import { StudentParser } from './student-parser';

export class CSVStudentDataAccessService {
  private static readonly BrowserStorageKey = 'TEASE-person-data';

  static readDataFromBrowserStorage(): Promise<[Student[], Team[]]> {
    const teamData = localStorage.getItem(CSVStudentDataAccessService.BrowserStorageKey);

    if (teamData === undefined || teamData === null) {
      return Promise.resolve([[], []]);
    }

    return new Promise((resolve, reject) => {
      Papa.parse(teamData, {
        complete: results => {
          const [persons, teams] = StudentParser.parsePersons(results.data);
          this.sortTeams(teams);
          resolve([persons, teams]);
        },
        header: true,
      });
    });
  }

  public static getSavedDataFromBrowserStorage(): string {
    return localStorage.getItem(CSVStudentDataAccessService.BrowserStorageKey);
  }

  public static readFromFile(csvFile: File): Promise<[Student[], Team[]]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        complete: results => {
          const [persons, teams] = StudentParser.parsePersons(results.data);
          this.sortTeams(teams);
          resolve([persons, teams]);
        },
        header: true,
      });
    });
  }

  public static readFromRemote(remoteFilePath: string): Promise<[Student[], Team[]]> {
    return new Promise((resolve, reject) => {
      Papa.parse(remoteFilePath, {
        download: true,
        complete: results => {
          const [persons, teams] = StudentParser.parsePersons(results.data);
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

  public static saveToBrowserStorage(persons: Student[]): Promise<boolean> {
    const personPropertyLists = persons.map(person => StudentSerializer.serializePerson(person));
    const result = Papa.unparse(personPropertyLists);
    localStorage.setItem(CSVStudentDataAccessService.BrowserStorageKey, result);
    return Promise.resolve(true);
  }

  public static clearSavedData() {
    localStorage.removeItem(CSVStudentDataAccessService.BrowserStorageKey);
  }
}
