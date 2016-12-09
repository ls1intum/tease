
import {TeamAccessService} from "./team.access.service";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
import {TeamSerializer} from "./serialization/TeamSerializer";
import Papa = require("papaparse");
import {TeamParser} from "./parsing/TeamParser";

export class PersistentTeamAccessService extends TeamAccessService {
  private static readonly TeamStorageKey = "Teams";

  read(): Promise<Team[]> {
    let teamData = localStorage.getItem(PersistentTeamAccessService.TeamStorageKey);
    if(teamData == undefined)return Promise.resolve([]);

    return new Promise((resolve,reject) => {
      Papa.parse(teamData, {
        complete: results => {
          resolve(TeamParser.parseTeams(results.data));
        },
        header: true
      });
    });
  }

  readCsvData(): string {
    return localStorage.getItem(PersistentTeamAccessService.TeamStorageKey);
  }

  readCsv(csvFile: File): Promise<Team[]> {
    return new Promise((resolve,reject) => {
      Papa.parse(csvFile, {
        complete: results => {
          resolve(TeamParser.parseTeams(results.data));
        },
        header: true
      });
    });
  }

  save(teams: Team[]) {
    let teamListProperties = TeamSerializer.serializeTeamList(teams);
    let result = Papa.unparse(teamListProperties);

    localStorage.setItem(PersistentTeamAccessService.TeamStorageKey,
      result);
  }

  dropData(){
    localStorage.removeItem(PersistentTeamAccessService.TeamStorageKey);
  }

  addTeamMember(person: Person, team: Team) {
    team.add(person);
  }

  removeTeamMember(person: Person, team: Team) {
    team.remove(person);
  }
}
