import { StudentConstraint } from './student-constraint';
import { Student } from '../student';
import { SkillLevel } from '../generated-model/skillLevel';

export class InstructorRatingStudentConstraint extends StudentConstraint {
  minimumRating: SkillLevel = SkillLevel.Novice;

  static getTyped(constraint: StudentConstraint): InstructorRatingStudentConstraint {
    if (constraint instanceof InstructorRatingStudentConstraint) return constraint;
    return null;
  }

  isFullfilledFor(student: Student): boolean {
    return student.supervisorAssessment >= this.minimumRating;
  }

  copy(): StudentConstraint {
    const newConstraint = new InstructorRatingStudentConstraint();
    newConstraint.minimumRating = this.minimumRating;
    return newConstraint;
  }
}
