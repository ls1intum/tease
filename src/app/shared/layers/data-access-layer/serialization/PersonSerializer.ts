import {Person} from "../../../models/person";
import {CsvColumnNames} from "../../../constants/data-access-constants";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export class PersonSerializer {
  static getProperties(person: Person): {} {
    let personProps = {};

    personProps[CsvColumnNames.Id] = person.id;
    personProps[CsvColumnNames.Major] = person.major;
    personProps[CsvColumnNames.FirstName] = person.firstName;
    personProps[CsvColumnNames.LastName] = person.lastName;

    return personProps;
  }


}
