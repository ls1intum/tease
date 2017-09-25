import {Injectable} from '@angular/core';
import {Person} from '../../models/person';
import {Team} from '../../models/team';

@Injectable()
export abstract class TeamAccessService {
  abstract saveTeams(teams: Team[]): Promise<boolean>;

  abstract readSavedTeams(): Promise<Team[]>;

  abstract readTeamsFromSource(file: File): Promise<Team[]>;

  abstract readTeamsFromRemote(remoteFilePath: string): Promise<Team[]> ;

  abstract dropData();

  abstract exportSavedTeamsAsCsv(): string;

  abstract addTeamMember(person: Person, team: Team);

  abstract removeTeamMember(person: Person, team: Team);
}
