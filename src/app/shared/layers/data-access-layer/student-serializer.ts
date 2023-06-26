import { Student, Gender } from '../../models/student';
import { StringHelper } from '../../helpers/string.helper';
import { CSVConstants } from '../../constants/csv.constants';
import { Device } from '../../models/device';
import { SkillLevel } from '../../models/skill';

export class StudentSerializer {
  static serializeStudent(student: Student): any {
    const studentProps = {};

    /* specified entries */
    studentProps[CSVConstants.Student.FirstName] = student.firstName;
    studentProps[CSVConstants.Student.LastName] = student.lastName;
    studentProps[CSVConstants.Student.Email] = student.email;
    studentProps[CSVConstants.Student.StudentId] = student.studentId;
    studentProps[CSVConstants.Student.Gender] = this.serializeGender(student.gender);
    studentProps[CSVConstants.Student.Nationality] = student.nationality;
    studentProps[CSVConstants.Student.StudyProgram] = student.studyProgram;
    studentProps[CSVConstants.Student.Semester] = student.semester;
    studentProps[CSVConstants.Student.GermanLanguageLevel] = student.germanLanguageLevel;
    studentProps[CSVConstants.Student.EnglishLanguageLevel] = student.englishLanguageLevel;
    studentProps[CSVConstants.Student.IntroSelfAssessment] = this.serializeSelfAssessment(student.introSelfAssessment);
    this.serializeStudentDevices(student, studentProps);
    this.serializeSkills(student, studentProps);
    this.serializePriorities(student, studentProps);
    studentProps[CSVConstants.Student.StudentComments] = student.studentComments;
    studentProps[CSVConstants.Student.SupervisorAssessment] = this.serializeSkillLevel(student.supervisorAssessment);
    studentProps[CSVConstants.Student.TutorComments] = student.tutorComments;
    studentProps[CSVConstants.Student.IsPinned] = String(student.isPinned);

    studentProps[CSVConstants.Team.TeamName] = student.team ? student.team.name : '';

    return studentProps;
  }

  private static serializePriorities(student: Student, studentProps: any) {
    for (const teamPrio of student.teamPriorities) {
      const columnName = StringHelper.format(CSVConstants.Team.Priority, student.getTeamPriority(teamPrio));

      studentProps[columnName] = teamPrio.name;
    }
  }

  private static serializeSkills(student: Student, studentProps: any) {
    for (const skill of student.skills) {
      const skillAbbreviation = CSVConstants.Skills.SkillNameAbbreviationPairs.find(pair => pair[0] === skill.name)[1];

      // skill description currently not populated yet
      // studentProps[skillAbbreviation + CSVConstants.Skills.DescriptionPostfix] = skill.description;

      studentProps[skillAbbreviation + CSVConstants.Skills.SkillLevelPostfix] = StudentSerializer.serializeSkillLevel(
        skill.skillLevel
      );

      studentProps[skillAbbreviation + CSVConstants.Skills.SkillLevelRationalePostfix] = skill.skillLevelRationale;
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
        return CSVConstants.Student.IntroSelfAssessmentAnswers.VeryHigh;
      case SkillLevel.High:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.VeryHigh;
      case SkillLevel.Medium:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.Medium;
      case SkillLevel.Low:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.Low;
      case SkillLevel.None:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.None;
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
