import {Person} from "../../../models/person";
import {Team} from "../../../models/team";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export interface TeamGenerator {
  generate(persons: Person[]): Promise<Team[]>
}
