import {TeamAccessService} from './team.access.service';
import {Person} from '../../models/person';
import {Team} from '../../models/team';
import {TeamSerializer} from './serialization/TeamSerializer';
import * as Papa from 'papaparse';
import {TeamParser} from './parsing/TeamParser';

export class PersistentTeamAccessService extends TeamAccessService {
  private static readonly TeamStorageKey = 'Teams';

  constructor() {
    super();
  }

  readSavedTeams(): Promise<Team[]> {
    const teamData = localStorage.getItem(PersistentTeamAccessService.TeamStorageKey);
    if (teamData === undefined) {
      return Promise.resolve([]);
    }

    return new Promise((resolve, reject) => {
      Papa.parse(teamData, {
        complete: results => {
          resolve(TeamParser.parseTeams(results.data));
        },
        header: true
      });
    });
  }

  exportSavedTeamsAsCsv(): string {
    return localStorage.getItem(PersistentTeamAccessService.TeamStorageKey);
  }

  readTeamsFromSource(csvFile: File): Promise<Team[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        complete: results => {
          resolve(TeamParser.parseTeams(results.data));
        },
        header: true
      });
    });
  }

  readTeamsFromRemote(remoteFilePath: string): Promise<Team[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(remoteFilePath, {
        download: true,
        complete: results => {
          resolve(TeamParser.parseTeams(results.data));
        },
        header: true
      });
    });
  }

  saveTeams(teams: Team[]): Promise<boolean> {
    let teamListProperties = TeamSerializer.serializeTeamList(teams);

    // sort the rows numerically by 'orderId'
    teamListProperties = teamListProperties.sort((a, b) => a.orderId - b.orderId);

    const result = Papa.unparse(teamListProperties);

    localStorage.setItem(PersistentTeamAccessService.TeamStorageKey, result);

    return Promise.resolve(true);
  }

  dropData() {
    localStorage.removeItem(PersistentTeamAccessService.TeamStorageKey);
  }

  addTeamMember(person: Person, team: Team) {
    team.add(person);
  }

  removeTeamMember(person: Person, team: Team) {
    team.remove(person);
  }
}
