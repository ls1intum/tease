import { Student } from '../student';

export abstract class StudentConstraint {
  abstract isFullfilledFor(student: Student): boolean;
  abstract copy(): StudentConstraint;
}
