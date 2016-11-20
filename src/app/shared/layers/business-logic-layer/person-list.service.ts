import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {PERSONS} from "../../models/mock-persons";
import Papa = require("papaparse");

/**
 * Created by wanur on 05/11/2016.
 */

@Injectable()
export class PersonListService {
  getSavedPersons(): Promise<Person[]>{
    return Promise.resolve(PERSONS);
  }

  readPersons(csvFile: File, callback: (persons: Person[])=>void) {
    Papa.parse(csvFile, {
      complete: results => {
        callback(this.parsePersons(results.data));
      },
      header: true
    });
  }

  parsePersons(csvString: Array<any>): Person[] {
    return csvString.map((personProps: Array<any>) => { return this.parsePerson(personProps) });
  }

  parsePerson(personProps: Array<any>): Person {
    let person = new Person();

    // TODO extract constants
    person.firstName = personProps["firstname"];
    person.major = personProps["major"];

    return person;
  }

  getPerson(id: number): Promise<Person>{
    return this.getSavedPersons().then(persons => persons.find(person => person.id == id))
  }
}
