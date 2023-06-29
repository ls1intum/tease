import { Student } from '../../models/student';
import { Team } from '../../models/team';
import * as Papa from 'papaparse';
import { StudentSerializer } from './student-serializer';
import { StudentParser } from './student-parser';
import { Skill } from '../../models/skill';

export class CSVStudentDataAccessService {
  private static readonly BrowserStorageKey = 'TEASE-student-data';

  static readDataFromBrowserStorage(): Promise<[Student[], Team[], Skill[]]> {
    const teamData = localStorage.getItem(CSVStudentDataAccessService.BrowserStorageKey);

    if (teamData === undefined || teamData === null) {
      return Promise.resolve([[], [], []]);
    }

    return new Promise((resolve, reject) => {
      Papa.parse(teamData, {
        complete: results => {
          const [students, teams, skills] = StudentParser.parseStudents(results.data);
          this.sortTeams(teams);
          resolve([students, teams, skills]);
        },
        header: true,
      });
    });
  }

  public static getSavedDataFromBrowserStorage(): string {
    return localStorage.getItem(CSVStudentDataAccessService.BrowserStorageKey);
  }

  public static readFromFile(csvFile: File): Promise<[Student[], Team[], Skill[]]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        complete: results => {
          const [students, teams, skills] = StudentParser.parseStudents(results.data);
          this.sortTeams(teams);
          resolve([students, teams, skills]);
        },
        header: true,
      });
    });
  }

  public static readFromRemote(remoteFilePath: string): Promise<[Student[], Team[], Skill[]]> {
    return new Promise((resolve, reject) => {
      Papa.parse(remoteFilePath, {
        download: true,
        complete: results => {
          const [students, teams, skills] = StudentParser.parseStudents(results.data);
          this.sortTeams(teams);
          console.log('CSVStudentDataAccessService:', students, teams, skills);
          resolve([students, teams, skills]);
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

  public static saveToBrowserStorage(students: Student[]): Promise<boolean> {
    // only serialize skill titles for the first student in the list
    const studentPropertyLists = students.map((student, index) => StudentSerializer.serializeStudent(student, index === 0));
    const result = Papa.unparse(studentPropertyLists);
    localStorage.setItem(CSVStudentDataAccessService.BrowserStorageKey, result);
    return Promise.resolve(true);
  }

  public static clearSavedData() {
    localStorage.removeItem(CSVStudentDataAccessService.BrowserStorageKey);
  }
}
