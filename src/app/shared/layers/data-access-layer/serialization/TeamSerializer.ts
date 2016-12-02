
import {Team} from "../../../models/team";
import {PersonSerializer} from "./PersonSerializer";
import {CsvColumnNamesTeam} from "../../../constants/data-access-constants";
export class TeamSerializer {
  static getTeamProperties(team: Team): {}[] {
    return team.persons.map(person => {
      let personProperties = PersonSerializer.getProperties(person);

      personProperties[CsvColumnNamesTeam.TeamName] = team.name;

      return personProperties;
    });
  }

  static getTeamListProperties(teams: Team[]): {}[] {
    let propList = teams.map(team => TeamSerializer.getTeamProperties(team));

    return [].concat(...propList);
  }
}
