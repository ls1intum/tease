
import {Team} from "../../../models/team";
import {PersonSerializer} from "./PersonSerializer";
export class TeamSerializer {
  static getTeamProperties(team: Team): {}[] {
    return team.persons.map(person => {
      return PersonSerializer.getProperties(person);
    });
  }

  static getTeamListProperties(teams: Team[]): {}[] {
    let propList = teams.map(team => TeamSerializer.getTeamProperties(team));
    return [].concat(...propList);
  }
}
