import {Injectable} from "@angular/core";
import {Person} from "../../../models/person";
import {PERSONS} from "../../../models/mock-persons";
import Papa = require("papaparse");
import {CsvColumnNames} from "../../../constants/data-access-constants";
import {PersonAccessService} from "../../data-access-layer/person.access.service";
import {NonPersistentPersonAccessService} from "../../data-access-layer/non-persistent-person.access.service";

/**
 * Created by wanur on 05/11/2016.
 */

@Injectable()
export class PersonService {
  constructor(private personAccessService: PersonAccessService){

  }

  readPersons(): Promise<Person[]>{
    return this.personAccessService.read();
  }

  readPerson(id: number): Promise<Person>{
    return this.readPersons().then(persons => persons.find(person => person.id == id))
  }

  savePersons(persons: Person[]){
    this.personAccessService.save(persons);
  }

  // TODO extract parsing to parser
  parsePersons(csvFile: File, callback: (persons: Person[])=>void) {
    Papa.parse(csvFile, {
      complete: results => {
        callback(this.parsePersonCSV(results.data));
      },
      header: true
    });
  }

  private parsePersonCSV(csvString: Array<any>): Person[] {
    return csvString.map((personProps: Array<any>) => { return this.parsePerson(personProps) });
  }

  private parsePerson(personProps: Array<any>): Person {
    let person = new Person();

    person.id = personProps[CsvColumnNames.Id];
    person.firstName = personProps[CsvColumnNames.FirstName];
    person.lastName = personProps[CsvColumnNames.LastName];
    person.major = personProps[CsvColumnNames.Major];
    // TODO parse other props

    return person;
  }
}
