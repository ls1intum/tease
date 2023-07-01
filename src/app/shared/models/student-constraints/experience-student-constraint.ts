import { StudentConstraint } from './student-constraint';
import { Student } from '../student';
import { SkillLevel } from '../generated-model/skillLevel';

export class ExperienceStudentConstraint extends StudentConstraint {
  minimumExperience: SkillLevel = SkillLevel.Novice;
  skillTitle: string;

  static getTyped(constraint: StudentConstraint): ExperienceStudentConstraint {
    if (constraint instanceof ExperienceStudentConstraint) return constraint;
    return null;
  }

  isFullfilledFor(student: Student): boolean {
    const skill = student.skills.find(assessment => assessment.skill.title === this.skillTitle);

    if (skill === undefined) return false;

    return skill.skillLevel >= this.minimumExperience;
  }

  copy(): StudentConstraint {
    const newConstraint = new ExperienceStudentConstraint();
    newConstraint.minimumExperience = this.minimumExperience;
    newConstraint.skillTitle = this.skillTitle;
    return newConstraint;
  }
}
