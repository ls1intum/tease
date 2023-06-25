import { StudentConstraint } from './student-constraint';
import { Student } from '../student';
import { SkillLevel } from '../skill';
import { GenderStudentConstraint } from './gender-student-constraint';

export class InstructorRatingStudentConstraint extends StudentConstraint {
  minimumRating: SkillLevel = SkillLevel.Low;

  static getTyped(constraint: StudentConstraint): InstructorRatingStudentConstraint {
    if (constraint instanceof InstructorRatingStudentConstraint) return constraint;
    return null;
  }

  isFullfilledFor(person: Student): boolean {
    return person.supervisorAssessment >= this.minimumRating;
  }

  copy(): StudentConstraint {
    const newConstraint = new InstructorRatingStudentConstraint();
    newConstraint.minimumRating = this.minimumRating;
    return newConstraint;
  }
}
