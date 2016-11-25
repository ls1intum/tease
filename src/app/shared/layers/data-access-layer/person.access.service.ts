import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

@Injectable()
export abstract class PersonAccessService {
  abstract save(persons: Person[]);
  abstract read(): Promise<Person[]>;
}
