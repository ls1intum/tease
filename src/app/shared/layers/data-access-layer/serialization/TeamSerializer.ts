
import {Team} from "../../../models/team";
import {PersonSerializer} from "./PersonSerializer";
import {CsvColumNames} from "../../../constants/csv-constants";

export class TeamSerializer {
  static serializeTeam(team: Team): {}[] {
    return team.persons.map(person => {
      let personProperties = PersonSerializer.serializePerson(person);

      personProperties[CsvColumNames.Team.TeamName] = team.name;

      return personProperties;
    });
  }

  static serializeTeamList(teams: Team[]): {}[] {
    let propList = teams.map(team => TeamSerializer.serializeTeam(team));

    return [].concat(...propList);
  }
}
