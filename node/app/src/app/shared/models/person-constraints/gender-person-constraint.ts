import {PersonConstraint} from './person-constraint';
import {Gender, Person} from '../person';
import {SkillLevel} from '../skill';

export class GenderPersonConstraint extends PersonConstraint {
  gender: Gender = Gender.Female;

  isFullfilledFor(person: Person): boolean {
    return person.gender === this.gender;
  }
}
