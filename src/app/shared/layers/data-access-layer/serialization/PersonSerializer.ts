import {Person} from "../../../models/person";
import {StringHelper} from "../../../helpers/StringHelper";
import {debug} from "util";
import {CsvColumNames} from "../../../constants/csv-constants";
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export class PersonSerializer {
  static serializePerson(person: Person): {} {
    let personProps = {};

    personProps[CsvColumNames.Person.Id] = person.id;
    personProps[CsvColumNames.Person.Major] = person.major;
    personProps[CsvColumNames.Person.FirstName] = person.firstName;
    personProps[CsvColumNames.Person.LastName] = person.lastName;
    personProps[CsvColumNames.Person.Term] = person.currentTerm;
    personProps[CsvColumNames.Person.IosDevExperience] = person.iosDevExperience;

    for(let teamPrio of person.teamPriorities){
      if(teamPrio == undefined)
        debugger;

      let columnName = StringHelper.format(CsvColumNames.Team.Priority,
        person.getTeamPriority(teamPrio));

      personProps[columnName] = teamPrio.name;
    }

    return personProps;
  }
}
