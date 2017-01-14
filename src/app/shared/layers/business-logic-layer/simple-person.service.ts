import {Person} from "../../models/person";
import {Injectable} from "@angular/core";
import {SkillLevel} from "../../models/skill";
import {PersonService} from "./person.service";
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

@Injectable()
export class SimplePersonService extends PersonService {
  getNextUnratedPerson(persons: Person[]): Person {
    let unratedPersons = persons.filter(p => !p.hasSupervisorRating());
    if(unratedPersons.length == 0)return undefined;

    return unratedPersons[0];
  }

  getPreviousRatedPerson(persons: Person[]): Person {
    return undefined;
  }

  // TODO to enable "previosPerson" button: just add array to this class
  // TODO where you append the last rated person each time
  ratePerson(person: Person, supervisorRating: SkillLevel){

  }
}
