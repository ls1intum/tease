import {TeamGenerationService} from "./team-generation.service";
import {Team} from "../../models/team";
import {Person} from "../../models/person";
import {Injectable} from "@angular/core";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

@Injectable()
export class DummyTeamGenerationService implements TeamGenerationService {
  private readonly NumberOfTeams = 10;

  generate(teams: Team[]): Promise<Team[]> {
    //
    // for(let teamIndex = 0;teamIndex<this.NumberOfTeams;teamIndex++){
    //   teams.push(new Team("test"));
    // }
    // teams[0].persons.push.apply(teams[0].persons,persons);
    //
    // // TODO slice into parts
    //
    return Promise.resolve(teams);
  }
}