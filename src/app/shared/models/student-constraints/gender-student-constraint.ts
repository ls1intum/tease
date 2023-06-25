import { StudentConstraint } from './student-constraint';
import { Gender, Student } from '../student';
import { SkillLevel } from '../skill';
import { ExperienceStudentConstraint } from './experience-student-constraint';

export class GenderStudentConstraint extends StudentConstraint {
  gender: Gender = Gender.Female;

  static getTyped(constraint: StudentConstraint): GenderStudentConstraint {
    if (constraint instanceof GenderStudentConstraint) return constraint;
    return null;
  }

  isFullfilledFor(person: Student): boolean {
    return person.gender === this.gender;
  }

  copy(): StudentConstraint {
    const newConstraint = new GenderStudentConstraint();
    newConstraint.gender = this.gender;
    return newConstraint;
  }
}
