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

    person.firstName = personProps[CSVConstants.Person.FirstName];
    person.lastName = personProps[CSVConstants.Person.LastName];
    person.email = personProps[CSVConstants.Person.Email];
    person.tumId = personProps[CSVConstants.Person.TumId];
    person.gender = this.parseGender(personProps[CSVConstants.Person.Gender]);
    person.major = personProps[CSVConstants.Person.Major];
    person.semester = personProps[CSVConstants.Person.Semester];
    person.germanLanguageLevel = personProps[CSVConstants.Person.GermanLanguageLevel];
    person.englishLanguageLevel = personProps[CSVConstants.Person.EnglishLanguageLevel];
    person.iosDev = personProps[CSVConstants.Person.IosDevExperience];
    person.appStoreLink = personProps[CSVConstants.Person.IosDevAppStoreLink];
    person.iOSDevExplained = personProps[CSVConstants.Person.IosDevExperienceExplained];
    person.introAssessment = personProps[CSVConstants.Person.IntroAssessment];
    this.parsePersonDevices(person, personProps);
    this.parsePersonSkills(person, personProps);
    person.otherSkills = personProps[CSVConstants.Person.OtherSkills];
    /* team priorities are parsed by team parser */
    person.studentComments = personProps[CSVConstants.Person.StudentComments];
    person.supervisorRating = this.parseSkillLevel(personProps[CSVConstants.Person.SupervisorRating]);
    person.tutorComments = personProps[CSVConstants.Person.TutorComments];

    return person;
  }

  private static parsePersonSkills(person: Person, personProps: Array<any>) {
    for (const [skillName, skillAbbreviation] of CSVConstants.Skills.SkillNameAbbreviationPairs) {
        const skillLevelString = personProps[CSVConstants.Skills.ExpInterPrefix + skillAbbreviation + CSVConstants.Skills.ExperiencePostfix];
        const interestLevelString = personProps[CSVConstants.Skills.ExpInterPrefix + skillAbbreviation + CSVConstants.Skills.InterestPostfix];
        const justificationString = personProps[CSVConstants.Skills.JustifyPrefix + skillAbbreviation];

        if (!(skillLevelString && interestLevelString))
          continue;

        let skillLevel: SkillLevel = CSVConstants.Skills.SkillLevelAnswers.indexOf(skillLevelString);
        if (!SkillLevel[skillLevel])
          skillLevel = SkillLevel.None;

        let interestLevel: SkillLevel = CSVConstants.Skills.InterestLevelAnswers.indexOf(interestLevelString);
        if (!SkillLevel[interestLevel])
          interestLevel = SkillLevel.None;

        person.skills.push(new Skill(skillName, skillLevel, interestLevel, justificationString ? justificationString : ""));
    }
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

    if (personProps[CSVConstants.Devices.Ipad] === available)
      person.addDevice(Device.Ipad);
    if (personProps[CSVConstants.Devices.Mac] === available)
      person.addDevice(Device.Mac);
    if (personProps[CSVConstants.Devices.Ipod] === available)
      person.addDevice(Device.Ipod);
    if (personProps[CSVConstants.Devices.Watch] === available)
      person.addDevice(Device.Watch);
    if (personProps[CSVConstants.Devices.Iphone] === available)
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
