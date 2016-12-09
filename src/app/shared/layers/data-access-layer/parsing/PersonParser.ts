import {Person} from "../../../models/person";
import {CsvColumNames, CsvValueNames} from "../../../constants/csv-constants";
import {Device, DeviceType} from "../../../models/device";
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
    person.iosDevExp = personProps[CsvColumNames.Person.IosDevExperience];
    person.iosDevExpDescription = personProps[CsvColumNames.Person.IosDevExperienceDescription];
    person.gitExpDescription = personProps[CsvColumNames.Person.GitExperience];
    person.email = personProps[CsvColumNames.Person.Email];
    this.parsePersonDevices(person,personProps);

    // TODO parse other props

    return person;
  }

  private static parsePersonDevices(person: Person, personProps: Array<any>) {
    let available = CsvValueNames.DeviceAvailableBoolean.Available;

    if(personProps[CsvColumNames.PersonDevices.Ipad] === available)
      person.addDevice(new Device(DeviceType.Ipad));
    if(personProps[CsvColumNames.PersonDevices.Mac] === available)
      person.addDevice(new Device(DeviceType.Mac));
    if(personProps[CsvColumNames.PersonDevices.Ipod] === available)
      person.addDevice(new Device(DeviceType.Ipod));
    if(personProps[CsvColumNames.PersonDevices.Watch] === available)
      person.addDevice(new Device(DeviceType.Watch));
    if(personProps[CsvColumNames.PersonDevices.Iphone] === available)
      person.addDevice(new Device(DeviceType.Iphone));
  }
}
