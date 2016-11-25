import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {PERSONS} from "../../models/mock-persons";
import {Team} from "../../models/team";
/**
 * Created by wanur on 05/11/2016.
 */

// TODO extract saving to data access layer

@Injectable()
export class TeamService {
  getSavedTeams(): Promise<Person[]>{
    return Promise.resolve(PERSONS);
  }

  saveTeams(teams: Team[]){
    // TODO implement
  }
}
