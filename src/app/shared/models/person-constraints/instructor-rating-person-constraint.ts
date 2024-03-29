import { PersonConstraint } from './person-constraint';
import { Person } from '../person';
import { SkillLevel } from '../skill';

export class InstructorRatingPersonConstraint extends PersonConstraint {
  minimumRating: SkillLevel = SkillLevel.Low;

  static getTyped(constraint: PersonConstraint): InstructorRatingPersonConstraint {
    if (constraint instanceof InstructorRatingPersonConstraint) return constraint;
    return null;
  }

  isFullfilledFor(person: Person): boolean {
    return person.supervisorRating >= this.minimumRating;
  }

  copy(): PersonConstraint {
    const newConstraint = new InstructorRatingPersonConstraint();
    newConstraint.minimumRating = this.minimumRating;
    return newConstraint;
  }
}
