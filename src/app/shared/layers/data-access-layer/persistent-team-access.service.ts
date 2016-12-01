
import {TeamAccessService} from "./team.access.service";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
import {TeamSerializer} from "./serialization/TeamSerializer";
export class PersistentTeamAccessService extends TeamAccessService {
  save(teams: Team[]) {
    let result = Papa.unparse(TeamSerializer.getTeamListProperties(teams));

    console.log(result);
  }

  read(): Promise<Team[]> {
    return undefined;
  }

  addTeamMember(person: Person, team: Team) {
    team.add(person);
  }

  removeTeamMember(person: Person, team: Team) {
    team.remove(person);
  }
}
