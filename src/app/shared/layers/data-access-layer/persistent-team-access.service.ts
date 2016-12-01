
import {TeamAccessService} from "./team.access.service";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
import {TeamSerializer} from "./serialization/TeamSerializer";
import Papa = require("papaparse");

export class PersistentTeamAccessService extends TeamAccessService {
  private savedTeams: Team[];

  read(): Promise<Team[]> {
    return Promise.resolve(this.savedTeams);
  }

  save(teams: Team[]) {
    let teamListProperties = TeamSerializer.getTeamListProperties(teams);
    debugger;
    let result = Papa.unparse(teamListProperties);

    console.log(result);
  }

  addTeamMember(person: Person, team: Team) {
    team.add(person);
  }

  removeTeamMember(person: Person, team: Team) {
    team.remove(person);
  }
}
