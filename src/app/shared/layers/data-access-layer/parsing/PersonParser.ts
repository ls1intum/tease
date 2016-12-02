import {Person} from "../../../models/person";
import {CsvColumnNamesPerson} from "../../../constants/data-access-constants";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export abstract class PersonParser {
  static parsePerson(personProps: Array<any>): Person {
    let person = new Person();

    // TODO check if this conversion works
    person.id = personProps[CsvColumnNamesPerson.Id];
    person.firstName = personProps[CsvColumnNamesPerson.FirstName];
    person.lastName = personProps[CsvColumnNamesPerson.LastName];
    person.major = personProps[CsvColumnNamesPerson.Major];
    // TODO parse other props

    return person;
  }
}
