import {Team} from '../../../models/team';
import {PersonSerializer} from './PersonSerializer';
import {CSVConstants} from '../../../constants/csv.constants';

export class TeamSerializer {
  static serializeTeam(team: Team): any[] {
    return team.persons.map(person => {
      const personProperties = PersonSerializer.serializePerson(person);

      personProperties[CSVConstants.Team.TeamName] = team.name;

      return personProperties;
    });
  }

  static serializeTeamList(teams: Team[]): any[] {
    const propList = teams.map(team => TeamSerializer.serializeTeam(team));

    return [].concat(...propList);
  }
}
