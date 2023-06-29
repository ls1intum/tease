import { Student} from '../../models/student';
import { StringHelper } from '../../helpers/string.helper';
import { CSVConstants } from '../../constants/csv.constants';
import { Device } from '../../models/device';
import { SkillLevel } from '../../models/generated-model/skillLevel';

export class StudentSerializer {
  static serializeStudent(student: Student, serializeTitles: boolean): any {
    const studentProps = {};

    /* specified entries */
    studentProps[CSVConstants.Student.FirstName] = student.firstName;
    studentProps[CSVConstants.Student.LastName] = student.lastName;
    studentProps[CSVConstants.Student.Email] = student.email;
    studentProps[CSVConstants.Student.StudentId] = student.studentId;
    studentProps[CSVConstants.Student.Gender] = student.gender;
    studentProps[CSVConstants.Student.Nationality] = student.nationality;
    studentProps[CSVConstants.Student.StudyProgram] = student.studyProgram;
    studentProps[CSVConstants.Student.Semester] = student.semester;
    studentProps[CSVConstants.Student.GermanLanguageLevel] = student.germanLanguageLevel;
    studentProps[CSVConstants.Student.EnglishLanguageLevel] = student.englishLanguageLevel;
    studentProps[CSVConstants.Student.IntroSelfAssessment] = CSVConstants.Student.IntroSelfAssessmentAnswers[student.introSelfAssessment];
    this.serializeStudentDevices(student, studentProps);
    this.serializeSkillSelfAssessments(student, studentProps, serializeTitles);
    this.serializePriorities(student, studentProps);
    studentProps[CSVConstants.Student.StudentComments] = student.studentComments;
    studentProps[CSVConstants.Student.SupervisorAssessment] = student.supervisorAssessment;
    studentProps[CSVConstants.Student.TutorComments] = student.tutorComments;
    studentProps[CSVConstants.Student.IsPinned] = String(student.isPinned);

    studentProps[CSVConstants.Team.TeamName] = student.team ? student.team.name : '';

    return studentProps;
  }

  private static serializePriorities(student: Student, studentProps: any) {
    for (const teamPrio of student.projectPriorities) {
      const columnName = StringHelper.format(CSVConstants.Team.Priority, student.getTeamPriority(teamPrio));

      studentProps[columnName] = teamPrio.name;
    }
  }

  private static serializeSkillSelfAssessments(student: Student, studentProps: any, serializeTitles: boolean) {
    const prefix = CSVConstants.Skills.SkillPrefix;
    for (const assessment of student.skills) {
      const skill = assessment.skill;
      studentProps[prefix + skill.id + CSVConstants.Skills.SkillLevelPostfix] = assessment.skillLevel;
      // only populate the title field if instructed, we do this for only one student when exporting back into CSV
      studentProps[prefix + skill.id + CSVConstants.Skills.SkillTitlePostfix] = (serializeTitles) ? assessment.skill.title : '';
      studentProps[prefix + skill.id + CSVConstants.Skills.SkillLevelRationalePostfix] = assessment.skillLevelRationale;
    }
  }

  private static serializeStudentDevices(student: Student, studentProps: object) {
    const unavailableString = CSVConstants.DeviceAvailableBooleanValue.Unavailable;
    const availableString = CSVConstants.DeviceAvailableBooleanValue.Available;

    studentProps[CSVConstants.Devices.Ipad] = student.ownsDevice(Device.Ipad) ? availableString : unavailableString;
    studentProps[CSVConstants.Devices.Iphone] = student.ownsDevice(Device.Iphone) ? availableString : unavailableString;
    studentProps[CSVConstants.Devices.Watch] = student.ownsDevice(Device.Watch) ? availableString : unavailableString;
    studentProps[CSVConstants.Devices.Mac] = student.ownsDevice(Device.Mac) ? availableString : unavailableString;
    studentProps[CSVConstants.Devices.IpadAR] = student.ownsDevice(Device.IpadAR) ? availableString : unavailableString;
    studentProps[CSVConstants.Devices.IphoneAR] = student.ownsDevice(Device.IphoneAR)
      ? availableString
      : unavailableString;
  }
}
