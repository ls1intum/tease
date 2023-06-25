import { Student, Gender } from '../../models/student';
import { CSVConstants } from '../../constants/csv.constants';
import { Device } from '../../models/device';
import { StringHelper } from '../../helpers/string.helper';
import { Skill, SkillLevel } from '../../models/skill';
import { Team } from '../../models/team';

export abstract class StudentParser {
  static parsePersons(teamCsvData: Array<any>): [Student[], Team[]] {
    const teams: Team[] = [];

    const students = teamCsvData
      .map((studentProps: Array<any>) => this.parsePerson(teams, studentProps))
      .filter(student => student !== null);

    return [students, teams];
  }

  private static parseTeamPriorities(teams: Team[], student: Student, studentProps: Array<any>) {
    for (let priority = 1; ; priority++) {
      const columnName = StringHelper.format(CSVConstants.Team.Priority, priority);

      if (!studentProps[columnName]) {
        break;
      }

      const team = this.getOrCreateTeam(teams, studentProps[columnName]);
      student.teamPriorities.push(team);
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

  static parsePerson(teams: Team[], studentProps: any): Student {
    const student = new Student();

    student.firstName = studentProps[CSVConstants.Person.FirstName];
    student.lastName = studentProps[CSVConstants.Person.LastName];
    student.email = studentProps[CSVConstants.Person.Email];
    student.studentId = studentProps[CSVConstants.Person.StudentId];
    student.gender = this.parseGender(studentProps[CSVConstants.Person.Gender]);
    student.nationality = studentProps[CSVConstants.Person.Nationality];
    student.studyProgram = studentProps[CSVConstants.Person.StudyProgram];
    student.semester = studentProps[CSVConstants.Person.Semester];
    student.germanLanguageLevel = studentProps[CSVConstants.Person.GermanLanguageLevel];
    student.englishLanguageLevel = studentProps[CSVConstants.Person.EnglishLanguageLevel];
    student.introSelfAssessment = this.parseSelfAssessment(studentProps[CSVConstants.Person.IntroSelfAssessment]);
    this.parsePersonDevices(student, studentProps);
    this.parsePersonSkills(student, studentProps);
    student.studentComments = studentProps[CSVConstants.Person.StudentComments];
    student.supervisorAssessment = this.parseSkillLevel(studentProps[CSVConstants.Person.SupervisorAssessment]);
    student.tutorComments = studentProps[CSVConstants.Person.TutorComments];
    if (studentProps.hasOwnProperty(CSVConstants.Person.IsPinned))
      student.isPinned = studentProps[CSVConstants.Person.IsPinned] === 'true';

    this.parseTeamPriorities(teams, student, studentProps);

    if (student.studentId === undefined || student.studentId.length === 0) {
      console.log('No studentId for student found. Cannot import.');
      return null;
    }

    student.team = this.getOrCreateTeam(teams, studentProps[CSVConstants.Team.TeamName]);

    if (student.team) student.team.persons.push(student);

    return student;
  }

  private static parsePersonSkills(student: Student, studentProps: Array<any>) {
    for (const [skillName, skillAbbreviation] of CSVConstants.Skills.SkillNameAbbreviationPairs) {
      // const skillDescriptionString = studentProps[skillAbbreviation + CSVConstants.Skills.DescriptionPostfix]

      const skillLevelString = studentProps[skillAbbreviation + CSVConstants.Skills.SkillLevelPostfix];

      const skillLevelRationaleString = studentProps[skillAbbreviation + CSVConstants.Skills.SkillLevelRationalePostfix];

      if (!(skillLevelString)) continue;

      let skillLevel: SkillLevel = StudentParser.parseSkillLevel(skillLevelString);

      // TODO: retrieve the skill description from the appropriate CSV column
      student.skills.push(
        new Skill(skillName, "placeholder: skill description", skillLevel, skillLevelRationaleString ? skillLevelRationaleString : '')
      );
    }
  }

  static parseSelfAssessment(selfAssessmentString: string): SkillLevel {
    if (selfAssessmentString === CSVConstants.Person.IntroSelfAssessmentAnswers.VeryHigh) return SkillLevel.VeryHigh;
    if (selfAssessmentString === CSVConstants.Person.IntroSelfAssessmentAnswers.High) return SkillLevel.High;
    if (selfAssessmentString === CSVConstants.Person.IntroSelfAssessmentAnswers.Medium) return SkillLevel.Medium;
    if (selfAssessmentString === CSVConstants.Person.IntroSelfAssessmentAnswers.Low) return SkillLevel.Low;
    if (selfAssessmentString === CSVConstants.Person.IntroSelfAssessmentAnswers.None) return SkillLevel.None;

    return SkillLevel.None;
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

  private static parsePersonDevices(student: Student, studentProps: Array<any>) {
    const available = CSVConstants.DeviceAvailableBooleanValue.Available;

    if (studentProps[CSVConstants.Devices.Ipad] === available) student.addDevice(Device.Ipad);
    if (studentProps[CSVConstants.Devices.Mac] === available) student.addDevice(Device.Mac);
    if (studentProps[CSVConstants.Devices.Watch] === available) student.addDevice(Device.Watch);
    if (studentProps[CSVConstants.Devices.Iphone] === available) student.addDevice(Device.Iphone);
    if (studentProps[CSVConstants.Devices.IphoneAR] === available) student.addDevice(Device.IphoneAR);
    if (studentProps[CSVConstants.Devices.IpadAR] === available) student.addDevice(Device.IpadAR);
  }

  private static parseArray(columnArrayName: string, studentProps: Array<any>): { [element: string]: string } {
    const array: { [element: string]: string } = {};

    for (const key in studentProps) {
      if (key.startsWith(columnArrayName)) {
        const arrayElement = StringHelper.getStringBetween(
          key,
          CSVConstants.ArrayBraces.Open,
          CSVConstants.ArrayBraces.Close
        );
        array[arrayElement] = studentProps[key];
      }
    }

    return array;
  }
}
