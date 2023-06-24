import { PersonConstraint } from './person-constraint';
import { Student } from '../student';
import { SkillLevel } from '../skill';
import { GenderPersonConstraint } from './gender-person-constraint';

export class InstructorRatingPersonConstraint extends PersonConstraint {
  minimumRating: SkillLevel = SkillLevel.Low;

  static getTyped(constraint: PersonConstraint): InstructorRatingPersonConstraint {
    if (constraint instanceof InstructorRatingPersonConstraint) return constraint;
    return null;
  }

  isFullfilledFor(person: Student): boolean {
    return person.supervisorAssessment >= this.minimumRating;
  }

  copy(): PersonConstraint {
    const newConstraint = new InstructorRatingPersonConstraint();
    newConstraint.minimumRating = this.minimumRating;
    return newConstraint;
  }
}
