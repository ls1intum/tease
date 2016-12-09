import {Person} from "../../../models/person";
import {StringHelper} from "../../../helpers/StringHelper";
import {debug} from "util";
import {CsvColumNames, CsvValueNames} from "../../../constants/csv-constants";
import {Device} from "../../../models/device";
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
    personProps[CsvColumNames.Person.IosDevExperience] = person.iosDevExp;
    personProps[CsvColumNames.Person.IosDevExperienceDescription] = person.iosDevExpDescription;
    personProps[CsvColumNames.Person.GitExperience] = person.gitExpDescription;
    personProps[CsvColumNames.Person.Email] = person.email;
    this.serializePersonDevices(person,personProps);
    this.serializePriorities(person, personProps);

    return personProps;
  }

  private static serializePriorities(person: Person, personProps: {}) {
    for (let teamPrio of person.teamPriorities) {
      if (teamPrio == undefined)
        debugger;

      let columnName = StringHelper.format(CsvColumNames.Team.Priority,
        person.getTeamPriority(teamPrio));

      personProps[columnName] = teamPrio.name;
    }
  }

  private static serializePersonDevices(person: Person, personProps: {}) {
    personProps[CsvColumNames.PersonDevices.Ipad] = person.devices.indexOf(Device.Ipad) ?
      CsvValueNames.DeviceAvailableBoolean.Available : CsvValueNames.DeviceAvailableBoolean.Unavailable;
    personProps[CsvColumNames.PersonDevices.Iphone] = person.devices.indexOf(Device.Iphone) ?
      CsvValueNames.DeviceAvailableBoolean.Available : CsvValueNames.DeviceAvailableBoolean.Unavailable;
    personProps[CsvColumNames.PersonDevices.Ipod] = person.devices.indexOf(Device.Ipod) ?
      CsvValueNames.DeviceAvailableBoolean.Available : CsvValueNames.DeviceAvailableBoolean.Unavailable;
    personProps[CsvColumNames.PersonDevices.Watch] = person.devices.indexOf(Device.Watch) ?
      CsvValueNames.DeviceAvailableBoolean.Available : CsvValueNames.DeviceAvailableBoolean.Unavailable;
    personProps[CsvColumNames.PersonDevices.Mac] = person.devices.indexOf(Device.Mac) ?
      CsvValueNames.DeviceAvailableBoolean.Available : CsvValueNames.DeviceAvailableBoolean.Unavailable;
  }
}
