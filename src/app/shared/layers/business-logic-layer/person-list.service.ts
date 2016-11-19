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
      complete: function(results){
        console.log(results);

        console.log(results.data[0]["firstname"]);

        callback(null);
      },
      header: true
    });
  }

  getPerson(id: number): Promise<Person>{
    return this.getSavedPersons().then(persons => persons.find(person => person.id == id))
  }
}
