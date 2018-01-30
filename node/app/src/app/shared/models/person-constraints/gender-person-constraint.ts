import {PersonConstraint} from './person-constraint';
import {Gender, Person} from '../person';
import {SkillLevel} from '../skill';
import {ExperiencePersonConstraint} from "./experience-person-constraint";

export class GenderPersonConstraint extends PersonConstraint {
  gender: Gender = Gender.Female;

  isFullfilledFor(person: Person): boolean {
    return person.gender === this.gender;
  }

  copy(): PersonConstraint {
    const newConstraint = new GenderPersonConstraint();
    newConstraint.gender = this.gender;
    return newConstraint;
  }
}
