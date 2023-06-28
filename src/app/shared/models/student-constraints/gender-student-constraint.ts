import { StudentConstraint } from './student-constraint';
import { Student } from '../student';
import { Gender } from '../generated-model/gender';

export class GenderStudentConstraint extends StudentConstraint {
  gender: Gender = Gender.Female;

  static getTyped(constraint: StudentConstraint): GenderStudentConstraint {
    if (constraint instanceof GenderStudentConstraint) return constraint;
    return null;
  }

  isFullfilledFor(student: Student): boolean {
    return student.gender === this.gender;
  }

  copy(): StudentConstraint {
    const newConstraint = new GenderStudentConstraint();
    newConstraint.gender = this.gender;
    return newConstraint;
  }
}
