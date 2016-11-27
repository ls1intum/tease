import {Person} from "../../../models/person";
import {Team} from "../../../models/team";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export abstract class TeamGenerator {
  abstract generate(persons: Person[]): Promise<Team[]>
}
