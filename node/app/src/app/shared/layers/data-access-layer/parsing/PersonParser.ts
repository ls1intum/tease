import {Person, Gender} from '../../../models/person';
import {CSVConstants} from '../../../constants/csv.constants';
import {Device} from '../../../models/device';
import {StringHelper} from '../../../helpers/string.helper';
import {Skill, SkillLevel} from '../../../models/skill';
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export abstract class PersonParser {
  static parsePerson(personProps: any): Person {
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
    person.introAssessmentTutor = personProps[CSVConstants.Person.IntroAssessmentTutor];
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
          skillLevel = null;

        let interestLevel: SkillLevel = CSVConstants.Skills.InterestLevelAnswers.indexOf(interestLevelString);
        if (!SkillLevel[interestLevel])
          interestLevel = null;

        person.skills.push(new Skill(skillName, skillLevel, interestLevel, justificationString ? justificationString : ""));
    }
  }

  static parseSkillLevel(skillLevelString: string): SkillLevel {
    if (skillLevelString === CSVConstants.SkillLevelValue.VeryHigh)
      return SkillLevel.VeryHigh;
    if (skillLevelString === CSVConstants.SkillLevelValue.High)
      return SkillLevel.High;
    if (skillLevelString === CSVConstants.SkillLevelValue.Medium)
      return SkillLevel.Medium;
    if (skillLevelString === CSVConstants.SkillLevelValue.Low)
      return SkillLevel.Low;
    if (skillLevelString === CSVConstants.SkillLevelValue.None)
      return SkillLevel.None;

    return null;
  }

  static parseGender(genderString: string): Gender {
    if (genderString === CSVConstants.GenderValue.Male)
      return Gender.Male;
    if (genderString === CSVConstants.GenderValue.Female)
      return Gender.Female;

    return Gender.Male;
  }

  private static parsePersonDevices(person: Person, personProps: Array<any>) {
    const available = CSVConstants.DeviceAvailableBooleanValue.Available;

    if (personProps[CSVConstants.Devices.Ipad] === available)
      person.addDevice(Device.Ipad);
    if (personProps[CSVConstants.Devices.Mac] === available)
      person.addDevice(Device.Mac);
    if (personProps[CSVConstants.Devices.Watch] === available)
      person.addDevice(Device.Watch);
    if (personProps[CSVConstants.Devices.Iphone] === available)
      person.addDevice(Device.Iphone);
  }

  private static parseArray(columnArrayName: string, personProps: Array<any>): {[element: string]: string} {
    const array: {[element: string]: string} = {};

    for (const key in personProps) {
      if (key.startsWith(columnArrayName)) {
        const arrayElement =
          StringHelper.getStringBetween(key, CSVConstants.ArrayBraces.Open, CSVConstants.ArrayBraces.Close);
        array[arrayElement] = personProps[key];
      }
    }

    return array;
  }
}
