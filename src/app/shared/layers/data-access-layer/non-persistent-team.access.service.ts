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

  save(teams: Team[]) {
    this.savedTeams = teams;
  }

  read(): Promise<Team[]> {
    return Promise.resolve(this.savedTeams);
  }
}