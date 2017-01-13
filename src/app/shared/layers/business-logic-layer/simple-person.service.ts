import {Person} from "../../models/person";
import {Injectable} from "@angular/core";
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

@Injectable()
export class SimplePersonService {
  getNextUnratedPerson(persons: Person[]): Person {
    return undefined;
  }

  getPreviousRatedPerson(persons: Person[]): Person {
    return undefined;
  }
}
