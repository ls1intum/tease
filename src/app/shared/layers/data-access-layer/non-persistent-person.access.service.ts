import {Person} from "../../models/person";
import {PersonAccessService} from "./person.access.service";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export class NonPersistentPersonAccessService extends PersonAccessService {
  private savedPersons: Person[];

  save(persons: Person[]) {
    this.savedPersons = persons;
  }

  read(): Promise<Person[]> {
    return Promise.resolve(this.savedPersons);
  }
}
