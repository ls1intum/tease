import {Person} from "../../models/person";
import {SkillLevel} from "../../models/skill";
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

export abstract class PersonService {
  abstract getNextUnratedPerson(persons: Person[]): Person;
  abstract getPreviousRatedPerson(persons: Person[]): Person;
  abstract ratePerson(person: Person, supervisorRating: SkillLevel);
}
