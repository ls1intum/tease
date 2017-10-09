import {Person, Gender} from '../../../models/person';
import {CsvColumNames, CSVConstants, CsvValueNames} from '../../../constants/csv.constants';
import {Device} from '../../../models/device';
import {StringHelper} from '../../../helpers/string.helper';
import {Skill, SkillLevel} from '../../../models/skill';
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export abstract class PersonParser {
  static parsePerson(personProps: any): Person {
    console.log(personProps);

    const person = new Person();

    person.id = personProps[CsvColumNames.Person.Id];
    person.firstName = personProps[CsvColumNames.Person.FirstName];
    person.lastName = personProps[CsvColumNames.Person.LastName];
    person.major = personProps[CsvColumNames.Person.Major];
    person.semester = personProps[CsvColumNames.Person.Semester];
    person.tumId = personProps[CsvColumNames.Person.TumId];
    person.iosDev = personProps[CsvColumNames.Person.IosDevExperience];
    person.iOSDevExplained = personProps[CsvColumNames.Person.IosDevExperienceDescription];
    person.gitExpDescription = personProps[CsvColumNames.Person.GitExperience];
    person.email = personProps[CsvColumNames.Person.Email];
    person.supervisorRating = this.parseSkillLevel(personProps[CsvColumNames.Person.SupervisorRating]);
    person.gender = this.parseGender(personProps[CsvColumNames.Person.Gender]);
    person.generalComments = personProps[CsvColumNames.Person.Comments];
    person.englishLanguageLevel = personProps[CsvColumNames.Person.EnglishLanguageLevel];
    person.germanLanguageLevel = personProps[CsvColumNames.Person.GermanLanguageLevel];

    this.parsePersonDevices(person, personProps);
    this.parsePersonSkills(person, personProps);

    return person;
  }

  private static parsePersonSkills(person: Person, personProps: Array<any>) {
    for (const key in CSVConstants.Skills.SkillAbbreviations) {
      if (CSVConstants.Skills.SkillAbbreviations.hasOwnProperty(key)) {

      }
    }

    /*
    const conceptProps = this.parseArray(CsvColumNames.PersonSkills.Concept, personProps);
    for (const skillKey in conceptProps) {
      if (conceptProps.hasOwnProperty(skillKey)) {
        const skillLevel = this.parseSkillLevel(conceptProps[skillKey]);
        person.skills.push(new Skill(skillKey, skillLevel));
      }
    }

    const techProps = this.parseArray(CsvColumNames.PersonSkills.Technology, personProps);
    for (const skillKey in techProps) {
      const skillLevel = this.parseSkillLevel(techProps[skillKey]);
      person.skills.push(new Skill(skillKey, skillLevel));
    }*/
  }

  static parseSkillLevel(skillLevelString: string): SkillLevel {
    if (skillLevelString === CsvValueNames.SkillLevelValue.VeryHigh)
      return SkillLevel.VeryHigh;
    if (skillLevelString === CsvValueNames.SkillLevelValue.High)
      return SkillLevel.High;
    if (skillLevelString === CsvValueNames.SkillLevelValue.Medium)
      return SkillLevel.Medium;
    if (skillLevelString === CsvValueNames.SkillLevelValue.Low)
      return SkillLevel.Low;
    if (skillLevelString === CsvValueNames.SkillLevelValue.None)
      return SkillLevel.None;

    return SkillLevel.None;
  }

  static parseGender(genderString: string): Gender {
    if (genderString === CsvValueNames.GenderValue.Male)
      return Gender.Male;
    if (genderString === CsvValueNames.GenderValue.Female)
      return Gender.Female;

    return Gender.Male;
  }

  private static parsePersonDevices(person: Person, personProps: Array<any>) {
    const available = CsvValueNames.DeviceAvailableBooleanValue.Available;

    if (personProps[CsvColumNames.PersonDevices.Ipad] === available)
      person.addDevice(Device.Ipad);
    if (personProps[CsvColumNames.PersonDevices.Mac] === available)
      person.addDevice(Device.Mac);
    if (personProps[CsvColumNames.PersonDevices.Ipod] === available)
      person.addDevice(Device.Ipod);
    if (personProps[CsvColumNames.PersonDevices.Watch] === available)
      person.addDevice(Device.Watch);
    if (personProps[CsvColumNames.PersonDevices.Iphone] === available)
      person.addDevice(Device.Iphone);
  }

  private static parseArray(columnArrayName: string, personProps: Array<any>): {[element: string]: string} {
    const array: {[element: string]: string} = {};

    for (const key in personProps) {
      if (key.startsWith(columnArrayName)) {
        const arrayElement = StringHelper.getStringBetween(key, CsvColumNames.ArrayBraces.Open, CsvColumNames.ArrayBraces.Close);
        array[arrayElement] = personProps[key];
      }
    }

    return array;
  }
}
