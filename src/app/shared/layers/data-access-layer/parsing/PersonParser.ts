import {Person} from "../../../models/person";
import {CsvColumnNames} from "../../../constants/data-access-constants";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export abstract class PersonParser {
  static parsePerson(personProps: Array<any>): Person {
    let person = new Person();

    person.id = personProps[CsvColumnNames.Id];
    person.firstName = personProps[CsvColumnNames.FirstName];
    person.lastName = personProps[CsvColumnNames.LastName];
    person.major = personProps[CsvColumnNames.Major];
    // TODO parse other props

    return person;
  }
}
