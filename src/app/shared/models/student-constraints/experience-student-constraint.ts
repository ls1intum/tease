import { StudentConstraint } from './student-constraint';
import { Student } from '../student';
import { SkillLevel } from '../skill';

export class ExperienceStudentConstraint extends StudentConstraint {
  minimumExperience: SkillLevel = SkillLevel.Low;
  skillName: string;

  static getTyped(constraint: StudentConstraint): ExperienceStudentConstraint {
    if (constraint instanceof ExperienceStudentConstraint) return constraint;
    return null;
  }

  isFullfilledFor(student: Student): boolean {
    const skill = student.skills.find(s => s.name === this.skillName);

    if (skill === undefined) return false;

    return skill.skillLevel >= this.minimumExperience;
  }

  copy(): StudentConstraint {
    const newConstraint = new ExperienceStudentConstraint();
    newConstraint.minimumExperience = this.minimumExperience;
    newConstraint.skillName = this.skillName;
    return newConstraint;
  }
}
