import {TeamGenerator} from "./TeamGenerator";
import {Team} from "../../../models/team";
import {Person} from "../../../models/person";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export class DummyTeamGenerator implements TeamGenerator {
  private readonly NumberOfTeams = 3;

  generate(persons: Person[]): Promise<Team[]> {
    let teamSize = persons.length / this.NumberOfTeams;

    // TODO slice into parts

    return Promise.resolve([new Team(1,persons)]);
  }
}