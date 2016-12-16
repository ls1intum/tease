import {Team} from "../models/team";
import {Person} from "../models/person";
/**
 * Created by Malte Bucksch on 16/12/2016.
 */

export abstract class TeamHelper {
  static getPersons(teams: Team[]): Person[] {
    return [].concat(...teams.map(team => team.persons));
  }
}
