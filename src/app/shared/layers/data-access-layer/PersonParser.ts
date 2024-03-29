import { Person, Gender } from '../../models/person';
import { CSVConstants } from '../../constants/csv.constants';
import { Device } from '../../models/device';
import { StringHelper } from '../../helpers/string.helper';
import { Skill, SkillLevel } from '../../models/skill';
import { Team } from '../../models/team';
import { IconMapperService } from '../../ui/icon-mapper.service';
/**
 * Created by Malte Bucksch on 01/12/2016.
 */

export abstract class PersonParser {
  static parsePersons(teamCsvData: Array<any>): [Person[], Team[]] {
    const teams: Team[] = [];
    const persons = teamCsvData
      .map((personProps: Array<any>) => {
        return this.parsePerson(teams, personProps);
      })
      .filter(person => person !== null);
    return [persons, teams];
  }

  private static parseTeamPriorities(teams: Team[], person: Person, personProps: Array<any>) {
    for (let priority = 1; ; priority++) {
      const columnName = StringHelper.format(CSVConstants.Team.Priority, priority);

      if (!personProps[columnName]) {
        break;
      }

      const team = this.getOrCreateTeam(teams, personProps[columnName]);
      person.teamPriorities.push(team.name);
    }
  }

  private static getOrCreateTeam(teams: Team[], teamName: string): Team {
    if (teamName === null || teamName === '') return null;

    const existingTeam = teams.find(team => team.name === teamName);

    if (existingTeam) {
      return existingTeam;
    } else {
      const newTeam = new Team(teamName);
      teams.push(newTeam);
      return newTeam;
    }
  }

  static parsePerson(teams: Team[], personProps: any): Person {
    const person = new Person();

    person.firstName = personProps[CSVConstants.Person.FirstName];
    person.lastName = personProps[CSVConstants.Person.LastName];
    person.email = personProps[CSVConstants.Person.Email];
    person.tumId = personProps[CSVConstants.Person.TumId];
    person.gender = this.parseGender(personProps[CSVConstants.Person.Gender]);
    person.nationality = personProps[CSVConstants.Person.Nationality];
    person.major = personProps[CSVConstants.Person.Major];
    if (person.major === CSVConstants.MajorOtherValue) person.major = personProps[CSVConstants.Person.MajorOther];
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
    person.studentComments = personProps[CSVConstants.Person.StudentComments];
    person.supervisorRating = this.parseSkillLevel(personProps[CSVConstants.Person.SupervisorRating]);
    person.tutorComments = personProps[CSVConstants.Person.TutorComments];
    if (personProps.hasOwnProperty(CSVConstants.Person.IsPinned))
      person.isPinned = personProps[CSVConstants.Person.IsPinned] === 'true';

    this.parseTeamPriorities(teams, person, personProps);

    if (person.tumId === undefined || person.tumId.length === 0) {
      console.log('No tumId for person found. Cannot import.');
      return null;
    }

    person.teamName = personProps[CSVConstants.Team.TeamName];
    if (person.teamName) {
      const teamIndex = teams.findIndex(team => team.name === person.teamName);
      if (teamIndex !== -1) teams[teamIndex].persons.push(person);
    }

    person.gravatarUrl = IconMapperService.getGravatarIcon(personProps[CSVConstants.Person.Email]);

    return person;
  }

  private static parsePersonSkills(person: Person, personProps: Array<any>) {
    for (const [skillName, skillAbbreviation] of CSVConstants.Skills.SkillNameAbbreviationPairs) {
      const skillLevelString =
        personProps[CSVConstants.Skills.ExpInterPrefix + skillAbbreviation + CSVConstants.Skills.ExperiencePostfix];
      //  At the moment there is no interestLevel in the Prompt CSV file
      // const interestLevelString =
      //  personProps[CSVConstants.Skills.ExpInterPrefix + skillAbbreviation + CSVConstants.Skills.InterestPostfix];
      const justificationString = personProps[CSVConstants.Skills.JustifyPrefix + skillAbbreviation];

      if (!skillLevelString) continue;

      let skillLevel: SkillLevel = CSVConstants.Skills.SkillLevelAnswers.indexOf(skillLevelString);
      if (!SkillLevel[skillLevel]) skillLevel = null;
      // At the moment there is no interestLevel in the Prompt CSV file
      // let interestLevel: SkillLevel = CSVConstants.Skills.InterestLevelAnswers.indexOf(interestLevelString);
      // if (!SkillLevel[interestLevel]) interestLevel = null;

      person.skills.push(new Skill(skillName, skillLevel, 0, justificationString ? justificationString : ''));
    }
  }

  static parseSkillLevel(skillLevelString: string): SkillLevel {
    if (skillLevelString === CSVConstants.SkillLevelValue.VeryHigh) return SkillLevel.VeryHigh;
    if (skillLevelString === CSVConstants.SkillLevelValue.High) return SkillLevel.High;
    if (skillLevelString === CSVConstants.SkillLevelValue.Medium) return SkillLevel.Medium;
    if (skillLevelString === CSVConstants.SkillLevelValue.Low) return SkillLevel.Low;
    if (skillLevelString === CSVConstants.SkillLevelValue.None) return SkillLevel.None;

    return SkillLevel.None;
  }

  static parseGender(genderString: string): Gender {
    if (genderString === CSVConstants.GenderValue.Male) return Gender.Male;
    if (genderString === CSVConstants.GenderValue.Female) return Gender.Female;

    return Gender.Male;
  }

  private static parsePersonDevices(person: Person, personProps: Array<any>) {
    const available = CSVConstants.DeviceAvailableBooleanValue.Available;

    if (personProps[CSVConstants.Devices.Ipad] === available) person.addDevice(Device.Ipad);
    if (personProps[CSVConstants.Devices.Mac] === available) person.addDevice(Device.Mac);
    if (personProps[CSVConstants.Devices.Watch] === available) person.addDevice(Device.Watch);
    if (personProps[CSVConstants.Devices.Iphone] === available) person.addDevice(Device.Iphone);
    if (personProps[CSVConstants.Devices.IphoneAR] === available) person.addDevice(Device.IphoneAR);
    if (personProps[CSVConstants.Devices.IpadAR] === available) person.addDevice(Device.IpadAR);
  }

  private static parseArray(columnArrayName: string, personProps: Array<any>): { [element: string]: string } {
    const array: { [element: string]: string } = {};

    for (const key in personProps) {
      if (key.startsWith(columnArrayName)) {
        const arrayElement = StringHelper.getStringBetween(
          key,
          CSVConstants.ArrayBraces.Open,
          CSVConstants.ArrayBraces.Close
        );
        array[arrayElement] = personProps[key];
      }
    }

    return array;
  }
}
