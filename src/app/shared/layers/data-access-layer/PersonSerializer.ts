import { Person, Gender } from '../../models/person';
import { StringHelper } from '../../helpers/string.helper';
import { CSVConstants } from '../../constants/csv.constants';
import { Device } from '../../models/device';
import { SkillLevel } from '../../models/skill';
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export class PersonSerializer {
  static serializePerson(person: Person): any {
    const personProps = {};

    /* specified entries */
    personProps[CSVConstants.Person.FirstName] = person.firstName;
    personProps[CSVConstants.Person.LastName] = person.lastName;
    personProps[CSVConstants.Person.Email] = person.email;
    personProps[CSVConstants.Person.StudentId] = person.studentId;
    personProps[CSVConstants.Person.Gender] = this.serializeGender(person.gender);
    personProps[CSVConstants.Person.Nationality] = person.nationality;
    personProps[CSVConstants.Person.StudyProgram] = person.studyProgram;
    personProps[CSVConstants.Person.Semester] = person.semester;
    personProps[CSVConstants.Person.GermanLanguageLevel] = person.germanLanguageLevel;
    personProps[CSVConstants.Person.EnglishLanguageLevel] = person.englishLanguageLevel;
    personProps[CSVConstants.Person.IntroSelfAssessment] = this.serializeSelfAssessment(person.introSelfAssessment);
    this.serializePersonDevices(person, personProps);
    this.serializeSkills(person, personProps);
    this.serializePriorities(person, personProps);
    personProps[CSVConstants.Person.StudentComments] = person.studentComments;
    personProps[CSVConstants.Person.SupervisorAssessment] = this.serializeSkillLevel(person.supervisorAssessment);
    personProps[CSVConstants.Person.TutorComments] = person.tutorComments;
    personProps[CSVConstants.Person.IsPinned] = String(person.isPinned);

    personProps[CSVConstants.Team.TeamName] = person.team ? person.team.name : '';

    return personProps;
  }

  private static serializePriorities(person: Person, personProps: any) {
    for (const teamPrio of person.teamPriorities) {
      const columnName = StringHelper.format(CSVConstants.Team.Priority, person.getTeamPriority(teamPrio));

      personProps[columnName] = teamPrio.name;
    }
  }

  private static serializeSkills(person: Person, personProps: any) {
    for (const skill of person.skills) {
      const skillAbbreviation = CSVConstants.Skills.SkillNameAbbreviationPairs.find(pair => pair[0] === skill.name)[1];

      // skill description currently not populated yet
      // personProps[skillAbbreviation + CSVConstants.Skills.DescriptionPostfix] = skill.description;

      personProps[skillAbbreviation + CSVConstants.Skills.SkillLevelPostfix] = PersonSerializer.serializeSkillLevel(
        skill.skillLevel
      );

      personProps[skillAbbreviation + CSVConstants.Skills.SkillLevelRationalePostfix] = skill.skillLevelRationale;
    }
  }

  private static serializeGender(gender: Gender) {
    switch (gender) {
      case Gender.Male:
        return CSVConstants.GenderValue.Male;
      case Gender.Female:
        return CSVConstants.GenderValue.Female;
    }
  }

  static serializeSkillLevel(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.VeryHigh:
        return CSVConstants.SkillLevelValue.VeryHigh;
      case SkillLevel.High:
        return CSVConstants.SkillLevelValue.High;
      case SkillLevel.Medium:
        return CSVConstants.SkillLevelValue.Medium;
      case SkillLevel.Low:
        return CSVConstants.SkillLevelValue.Low;
      case SkillLevel.None:
        return CSVConstants.SkillLevelValue.None;
    }
  }

  static serializeSelfAssessment(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.VeryHigh:
        return CSVConstants.Person.IntroSelfAssessmentAnswers.VeryHigh;
      case SkillLevel.High:
        return CSVConstants.Person.IntroSelfAssessmentAnswers.VeryHigh;
      case SkillLevel.Medium:
        return CSVConstants.Person.IntroSelfAssessmentAnswers.Medium;
      case SkillLevel.Low:
        return CSVConstants.Person.IntroSelfAssessmentAnswers.Low;
      case SkillLevel.None:
        return CSVConstants.Person.IntroSelfAssessmentAnswers.None;
    }
  }

  private static serializePersonDevices(person: Person, personProps: object) {
    const unavailableString = CSVConstants.DeviceAvailableBooleanValue.Unavailable;
    const availableString = CSVConstants.DeviceAvailableBooleanValue.Available;

    personProps[CSVConstants.Devices.Ipad] = person.ownsDevice(Device.Ipad) ? availableString : unavailableString;
    personProps[CSVConstants.Devices.Iphone] = person.ownsDevice(Device.Iphone) ? availableString : unavailableString;
    personProps[CSVConstants.Devices.Watch] = person.ownsDevice(Device.Watch) ? availableString : unavailableString;
    personProps[CSVConstants.Devices.Mac] = person.ownsDevice(Device.Mac) ? availableString : unavailableString;
    personProps[CSVConstants.Devices.IpadAR] = person.ownsDevice(Device.IpadAR) ? availableString : unavailableString;
    personProps[CSVConstants.Devices.IphoneAR] = person.ownsDevice(Device.IphoneAR)
      ? availableString
      : unavailableString;
  }
}
