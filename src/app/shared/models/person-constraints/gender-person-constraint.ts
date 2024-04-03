import { PersonConstraint } from './person-constraint';
import { Gender, Person } from '../person';

export class GenderPersonConstraint extends PersonConstraint {
  gender: Gender = Gender.Female;

  static getTyped(constraint: PersonConstraint): GenderPersonConstraint {
    if (constraint instanceof GenderPersonConstraint) return constraint;
    return null;
  }

  isFullfilledFor(person: Person): boolean {
    return person.gender === this.gender;
  }

  copy(): PersonConstraint {
    const newConstraint = new GenderPersonConstraint();
    newConstraint.gender = this.gender;
    return newConstraint;
  }
}
