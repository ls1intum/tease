import {PersonConstraint} from './person-constraint';
import {Person} from '../person';
import {SkillLevel} from '../skill';
import {ExperiencePersonConstraint} from "./experience-person-constraint";

export class InterestPersonConstraint extends PersonConstraint {
  minimumInterest: SkillLevel = SkillLevel.Low;
  skillName: string;

  static getTyped(constraint: PersonConstraint): InterestPersonConstraint {
    if (constraint instanceof InterestPersonConstraint)
    return constraint;
    return null;
  }

  isFullfilledFor(person: Person): boolean {
    const skill = person.skills.find(s => s.name === this.skillName);

    if (skill === undefined)
      return false;

    return skill.interestLevel >= this.minimumInterest;
  }

  copy(): PersonConstraint {
    const newConstraint = new InterestPersonConstraint();
    newConstraint.minimumInterest = this.minimumInterest;
    newConstraint.skillName = this.skillName;
    return newConstraint;
  }
}
