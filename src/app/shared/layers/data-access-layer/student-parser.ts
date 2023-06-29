import { Student } from '../../models/student';
import { Gender } from '../../models/generated-model/gender';
import { CSVConstants } from '../../constants/csv.constants';
import { Device } from '../../models/device';
import { StringHelper } from '../../helpers/string.helper';
import { Skill } from '../../models/skill';
import { SkillLevel } from '../../models/generated-model/skillLevel';
import { Team } from '../../models/team';
import { SkillSelfAssessment } from '../../models/generated-model/skillSelfAssessment';

export abstract class StudentParser {
  static parseStudents(teamCsvData: Array<any>): [Student[], Team[], Skill[]] {
    const teams: Team[] = [];
    const skills: Skill[] = [];

    const students = teamCsvData
      .map((studentProps: Array<any>) => this.parseStudent(teams, skills, studentProps))
      .filter(student => student !== null);

    return [students, teams, skills];
  }

  private static parseTeamPriorities(teams: Team[], student: Student, studentProps: Array<any>) {
    for (let priority = 1; ; priority++) {
      const columnName = StringHelper.format(CSVConstants.Team.Priority, priority);

      if (!studentProps[columnName]) {
        break;
      }

      const team = this.getOrCreateTeam(teams, studentProps[columnName]);
      student.projectPriorities.push(team);
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

  /**
   * Retrieves a matching skill by ID or creates a new Skill object if none are found
   * If the skill already exists in the array but the title hasn't been set yet,
   * populate this property of the object in the array
   * @param skills the current list of skills so far discovered while parsing the CSV
   * @param skillTitle the title of the skill - can be empty
   * @returns the skill referenced by the ID
   */
  private static getOrCreateSkill(skills: Skill[], skillId: string, skillTitle: string): Skill {
    let skill: Skill = skills.find(skill => skill.id === skillId);
    if (!skill) {
      skill = new Skill(skillId, skillTitle, ''); // we don't require a skill description when parsing the CSV
      skills.push(skill);
    } else {
      skill.setIfMissing(skillTitle);
    }
    return skill;
  }

  static parseStudent(teams: Team[], skills: Skill[], studentProps: any): Student {
    const student = new Student();

    student.firstName = studentProps[CSVConstants.Student.FirstName];
    student.lastName = studentProps[CSVConstants.Student.LastName];
    student.email = studentProps[CSVConstants.Student.Email];
    student.studentId = studentProps[CSVConstants.Student.StudentId];
    student.gender = studentProps[CSVConstants.Student.Gender];

    student.nationality = studentProps[CSVConstants.Student.Nationality];
    student.studyProgram = studentProps[CSVConstants.Student.StudyProgram];
    student.semester = studentProps[CSVConstants.Student.Semester];
    student.germanLanguageLevel = studentProps[CSVConstants.Student.GermanLanguageLevel];
    student.englishLanguageLevel = studentProps[CSVConstants.Student.EnglishLanguageLevel];
    student.introSelfAssessment = this.parseSelfAssessment(studentProps[CSVConstants.Student.IntroSelfAssessment]);
    this.parseStudentDevices(student, studentProps);
    this.parseStudentSkillSelfAssessments(skills, student, studentProps);
    student.studentComments = studentProps[CSVConstants.Student.StudentComments];
    student.supervisorAssessment = studentProps[CSVConstants.Student.SupervisorAssessment];
    student.tutorComments = studentProps[CSVConstants.Student.TutorComments];
    if (studentProps.hasOwnProperty(CSVConstants.Student.IsPinned))
      student.isPinned = studentProps[CSVConstants.Student.IsPinned] === 'true';

    this.parseTeamPriorities(teams, student, studentProps);

    if (student.studentId === undefined || student.studentId.length === 0) {
      console.log('No studentId for student found. Cannot import.');
      return null;
    }

    student.team = this.getOrCreateTeam(teams, studentProps[CSVConstants.Team.TeamName]);

    if (student.team) student.team.students.push(student);

    return student;
  }

  private static parseStudentSkillSelfAssessments(skills: Skill[], student: Student, studentProps: Array<any>) {
    const prefix = CSVConstants.Skills.SkillPrefix;
    for (const skillId of CSVConstants.Skills.SkillIds) {

      const skillLevelString = studentProps[prefix + skillId + CSVConstants.Skills.SkillLevelPostfix];
      const skillTitle = studentProps[prefix + skillId + CSVConstants.Skills.SkillTitlePostfix]
      const skillLevelRationaleString = studentProps[prefix + skillId + CSVConstants.Skills.SkillLevelRationalePostfix];

      if (!skillLevelString) {
        console.log("could not find skill with id " + skillId);
        continue; // skip to the next skill if there are no columns for it (assumed if no skill level exists)
      }

      const skill: Skill = this.getOrCreateSkill(skills, skillId, skillTitle);

      student.skills.push(
        new SkillSelfAssessment(skill, skillLevelString, skillLevelRationaleString)
      );
    }
  }

  static parseSelfAssessment(selfAssessmentString: string): SkillLevel {
    let answers = CSVConstants.Student.IntroSelfAssessmentAnswers;
    for (var key in answers) {
      // neither of the two lines below seem safe
      // TODO: refactor this and parse the self assessment answer strings in a better way
      if (answers[key] === selfAssessmentString) {
        return key as SkillLevel;
      }
    }
    return SkillLevel.Novice;
  }

  private static parseStudentDevices(student: Student, studentProps: Array<any>) {
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
