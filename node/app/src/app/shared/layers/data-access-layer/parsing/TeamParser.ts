import {Team} from '../../../models/team';
import {PersonParser} from './PersonParser';
import {CsvColumNames} from '../../../constants/csv.constants';
import {Person} from '../../../models/person';
import {StringHelper} from '../../../helpers/string.helper';

declare interface TeamList { [id: string]: Team; }

export class TeamParser {

  static parseTeams(teamCsvData: Array<any>): Team[] {
    const teams: TeamList = {};

    const persons = teamCsvData
      .map((personProps: Array<any>, index: number) => {
        const person = PersonParser.parsePerson(personProps);
        if (person.tumId === undefined || person.tumId.length === 0) {
          console.log('No tumId for person found. Cannot import.');
          return undefined;
        }

        person.orderId = index;

        this.parsePriorities(teams, person, personProps);
        this.addTeam(teams, personProps[CsvColumNames.Team.TeamName], person);

        return person;

      }).filter(person => person !== undefined);

    this.addOrphansTeam(teams, persons);

    return Object.values(teams);
  }

  private static addOrphansTeam(teams: TeamList, persons: Person[]) {
    if (teams[Team.OrphanTeamName] === undefined) teams[Team.OrphanTeamName] = new Team(Team.OrphanTeamName);
    const orphanTeam = teams[Team.OrphanTeamName];

    for (const person of persons) {
      if (person.team !== undefined)continue;

      orphanTeam.add(person);
    }
  }

  private static parsePriorities(teams: TeamList, person: Person, personProps: Array<any>) {

    for (let prio = 1; ; prio++) {
      const columnName = StringHelper.format(CsvColumNames.Team.Priority, prio);

      // No such priority.
      if (!personProps[columnName]) {
        break;
      }

      const team = this.addTeam(teams, personProps[columnName]);
      person.teamPriorities.push(team);
    }
  }

  private static addTeam(teams: TeamList, name: string, person?: Person): Team {
    if (name === undefined)return undefined;

    if (teams[name] === undefined)
      teams[name] = new Team(name);

    if (person === undefined)return teams[name];
    teams[name].add(person);

    return teams[name];
  }
}
