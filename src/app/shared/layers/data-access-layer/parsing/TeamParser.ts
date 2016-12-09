import {Team} from "../../../models/team";
import {PersonParser} from "./PersonParser";
import {CsvTeamPrioritiesCount, CsvColumNames} from "../../../constants/csv-constants";
import {Person} from "../../../models/person";
import {StringHelper} from "../../../helpers/StringHelper";

declare type TeamList = {[id: string]: Team};

export class TeamParser {

  static parseTeams(teamCsvData: Array<any>): Team[] {
    let teams: TeamList = {};

    let persons = teamCsvData.map((personProps: Array<any>) => {
      let person = PersonParser.parsePerson(personProps);

      this.parsePriorities(teams, person, personProps);
      this.addTeam(teams, personProps[CsvColumNames.Team.TeamName], person);

      return person;
    });

    this.addOrphansTeam(teams,persons);

    return Object.values(teams);
  }

  private static addOrphansTeam(teams: TeamList, persons: Person[]){
    if(teams[Team.OrphanTeamName] == undefined)teams[Team.OrphanTeamName] = new Team(Team.OrphanTeamName);
    let orphanTeam = teams[Team.OrphanTeamName];

    for(let person of persons){
      if(person.team != undefined)continue;

      orphanTeam.add(person);
    }
  }

  private static parsePriorities(teams: TeamList, person: Person, personProps: Array<any>) {
    for (let prio = 1; prio <= CsvTeamPrioritiesCount; prio++) {
      let columnName = StringHelper.format(CsvColumNames.Team.Priority, prio);

      if(!personProps[columnName])continue;

      let team = this.addTeam(teams, personProps[columnName]);
      person.teamPriorities.push(team);
    }
  }

  private static addTeam(teams: TeamList, name: string, person?: Person): Team {
    if (name == undefined)return undefined;

    if (teams[name] == undefined)
      teams[name] = new Team(name);

    if (person == undefined)return teams[name];
    teams[name].add(person);

    return teams[name];
  }
}
