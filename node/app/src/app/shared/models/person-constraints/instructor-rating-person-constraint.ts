import {PersonConstraint} from './person-constraint';
import {Person} from '../person';
import {SkillLevel} from '../skill';

export class InstructorRatingPersonConstraint extends PersonConstraint {
  minimumRating: SkillLevel = SkillLevel.Low;

  isFullfilledFor(person: Person): boolean {
    return person.supervisorRating >= this.minimumRating;
  }
}
