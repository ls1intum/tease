import {PersonConstraint} from './person-constraint';
import {Person} from '../person';
import {SkillLevel} from '../skill';
import {GenderPersonConstraint} from "./gender-person-constraint";

export class InstructorRatingPersonConstraint extends PersonConstraint {
  minimumRating: SkillLevel = SkillLevel.Low;

  isFullfilledFor(person: Person): boolean {
    return person.supervisorRating >= this.minimumRating;
  }

  copy(): PersonConstraint {
    const newConstraint = new InstructorRatingPersonConstraint();
    newConstraint.minimumRating = this.minimumRating;
    return newConstraint;
  }
}
