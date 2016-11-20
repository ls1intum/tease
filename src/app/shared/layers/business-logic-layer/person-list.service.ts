import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {PERSONS} from "../../models/mock-persons";
import Papa = require("papaparse");
import {CsvColumnNames} from "../../constants/data-access-constants";

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

  private parsePersons(csvString: Array<any>): Person[] {
    return csvString.map((personProps: Array<any>) => { return this.parsePerson(personProps) });
  }

  private parsePerson(personProps: Array<any>): Person {
    let person = new Person();

    person.firstName = personProps[CsvColumnNames.FirstName];
    person.major = personProps[CsvColumnNames.Major];
    // TODO parse other props

    return person;
  }

  getPerson(id: number): Promise<Person>{
    return this.getSavedPersons().then(persons => persons.find(person => person.id == id))
  }
}
