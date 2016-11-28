import {TeamGenerator} from "./TeamGenerator";
import {Team} from "../../../models/team";
import {Person} from "../../../models/person";
import {Injectable} from "@angular/core";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

@Injectable()
export class DummyTeamGenerator implements TeamGenerator {
  private readonly NumberOfTeams = 3;

  generate(persons: Person[]): Promise<Team[]> {
    let teams: Team[] = [];

    for(let teamIndex = 0;teamIndex<this.NumberOfTeams;teamIndex++){
      teams.push(new Team(teamIndex,[]));
    }
    teams[0].persons.push.apply(teams[0].persons,persons);

    // TODO slice into parts

    return Promise.resolve(teams);
  }
}
