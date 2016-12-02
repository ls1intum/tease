import {Person} from "../../../models/person";
import {CsvColumnNamesPerson, CsvColumnNamesTeam} from "../../../constants/data-access-constants";
import {StringHelper} from "../../../helpers/StringHelper";
import {debug} from "util";
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

    for(let teamPrio of person.teamPriorities){
      if(teamPrio == undefined)
        debugger;

      let columnName = StringHelper.format(CsvColumnNamesTeam.Priority,
        person.getTeamPriority(teamPrio));

      personProps[columnName] = teamPrio.name;
    }

    return personProps;
  }


}
