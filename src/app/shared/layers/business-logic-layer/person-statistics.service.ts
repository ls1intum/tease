import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

@Injectable()
export class PersonStatisticsService {
  getRatedPersonCount(persons: Person[]): number {
    return persons.filter(p => p.hasSupervisorRating()).length;
  }

  // ...  priority count etc
}
