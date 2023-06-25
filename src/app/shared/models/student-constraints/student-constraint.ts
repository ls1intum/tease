import { Student } from '../student';

export abstract class StudentConstraint {
  abstract isFullfilledFor(person: Student): boolean;
  abstract copy(): StudentConstraint;
}
