import {Team} from "../../../models/team";
import {PersonParser} from "./PersonParser";
import {CsvColumnNamesTeam, CsvTeamPrioritiesCount} from "../../../constants/data-access-constants";
import {Person} from "../../../models/person";
import {StringHelper} from "../../../helpers/StringHelper";

declare type TeamList = {[id: string]: Team};

export class TeamParser {

  static parseTeams(teamCsvData: Array<any>): Team[] {
    let teams: TeamList = {};

    let persons = teamCsvData.map((personProps: Array<any>) => {
      let person = PersonParser.parsePerson(personProps);

      this.parsePriorities(teams, personProps);
      this.addTeam(teams, personProps[CsvColumnNamesTeam.TeamName], person);

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

  private static parsePriorities(teams: TeamList, personProps: Array<any>) {
    for (let prio = 1; prio < CsvTeamPrioritiesCount; prio++) {
      let columnName = StringHelper.format(CsvColumnNamesTeam.Priority, prio);

      this.addTeam(teams, personProps[columnName]);
    }
  }

  private static addTeam(teams: TeamList, name: string, person?: Person) {
    if (name == undefined)return;

    if (teams[name] == undefined)
      teams[name] = new Team(name);

    if (person == undefined)return;
    teams[name].add(person);
  }
}