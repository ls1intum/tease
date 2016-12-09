import {Person} from "../../../models/person";
import {CsvColumNames, CsvValueNames} from "../../../constants/csv-constants";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export abstract class PersonParser {
  static parsePerson(personProps: Array<any>): Person {
    let person = new Person();

    // TODO check if this conversion works
    person.id = personProps[CsvColumNames.Person.Id];
    person.firstName = personProps[CsvColumNames.Person.FirstName];
    person.lastName = personProps[CsvColumNames.Person.LastName];
    person.major = personProps[CsvColumNames.Person.Major];
    if (person.major === CsvValueNames.MajorOther)
      person.major = personProps[CsvColumNames.Person.MajorOther];
    person.currentTerm = personProps[CsvColumNames.Person.Term];

    // TODO parse other props

    return person;
  }

  private parseLanguages() {

  }
}
