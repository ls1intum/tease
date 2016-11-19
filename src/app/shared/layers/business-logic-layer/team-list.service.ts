import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {PERSONS} from "../../models/mock-persons";
import {Team} from "../../models/team";
/**
 * Created by wanur on 05/11/2016.
 */

@Injectable()
export class TeamListService {
  getSavedTeams(): Promise<Person[]>{
    return Promise.resolve(PERSONS);
  }

  saveTeams(teams: Team[]){
    // TODO implement
  }
}
