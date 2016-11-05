import {Injectable} from "@angular/core";
import {Person} from "../models/person";
import {PERSONS} from "../models/mock-persons";
/**
 * Created by wanur on 05/11/2016.
 */

@Injectable
export class PersonService {
  getPersons(): Promise<Person[]>{
    return Promise.resolve(PERSONS);
  }

  getPerson(id: number): Promise<Person>{
    return this.getPersons().then(persons => persons.find(person => person.id == id))
  }
}
