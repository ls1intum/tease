import {Person} from "../../models/person";
import {PersonAccessService} from "./person.access.service";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export class NonPersistentPersonAccessService extends PersonAccessService {
  private static savedPersons: Person[];

  save(persons: Person[]) {
    NonPersistentPersonAccessService.savedPersons = persons;
  }

  read(): Promise<Person[]> {
    return Promise.resolve(NonPersistentPersonAccessService.savedPersons);
  }
}
