import {Person} from "../../../models/person";
import {CsvColumnNamesPerson} from "../../../constants/data-access-constants";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export class PersonSerializer {
  static getProperties(person: Person): {} {
    let personProps = {};

    personProps[CsvColumnNamesPerson.Id] = person.id;
    personProps[CsvColumnNamesPerson.Major] = person.major;
    personProps[CsvColumnNamesPerson.FirstName] = person.firstName;
    personProps[CsvColumnNamesPerson.LastName] = person.lastName;

    return personProps;
  }


}
