/**
 * Created by Malte Bucksch on 25/11/2016.
 */
import {Person} from "../../models/person";
import {PersonAccessService} from "./person.access.service";
import {TeamAccessService} from "./team.access.service";
import {Team} from "../../models/team";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export class NonPersistentTeamAccessService extends TeamAccessService {
  private savedTeams: Team[];

  readCsv(csvFile: File): Promise<Team[]> {
    return undefined;
  }

  addTeamMember(person: Person, team: Team) {
    team.add(person);
  }

  removeTeamMember(person: Person, team: Team) {
    team.remove(person);
  }

  dropData(){
    this.savedTeams = [];
  }

  save(teams: Team[]) {
    this.savedTeams = teams;
  }

  read(): Promise<Team[]> {
    return Promise.resolve(this.savedTeams);
  }
}
