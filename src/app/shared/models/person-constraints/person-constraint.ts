import { Person } from '../person';

export abstract class PersonConstraint {
  abstract isFullfilledFor(person: Person): boolean;
  abstract copy(): PersonConstraint;
}
