import { Student } from '../student';

export abstract class PersonConstraint {
  abstract isFullfilledFor(person: Student): boolean;
  abstract copy(): PersonConstraint;
}
