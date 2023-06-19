import { Student } from '../person';

export abstract class PersonConstraint {
  abstract isFullfilledFor(person: Student): boolean;
  abstract copy(): PersonConstraint;
}
