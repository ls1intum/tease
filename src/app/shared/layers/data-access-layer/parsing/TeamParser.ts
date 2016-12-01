
import {Team} from "../../../models/team";
import {PersonParser} from "./PersonParser";
export abstract class TeamParser {
  static parseTeams(teamCsvData: Array<any>): Team[] {
    let persons = teamCsvData.map((personProps: Array<any>) =>
    { return PersonParser.parsePerson(personProps) });

    // TODO use real team column to map teams

    return [new Team(0,persons)];
  }
}
