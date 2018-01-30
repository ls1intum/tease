import {PersonConstraint} from './person-constraint';
import {Person} from '../person';
import {SkillLevel} from '../skill';
import {DevicePossessionPersonConstraint} from "./device-possession-person-constraint";

export class ExperiencePersonConstraint extends PersonConstraint {
  minimumExperience: SkillLevel = SkillLevel.Low;
  skillName: string;

  isFullfilledFor(person: Person): boolean {
    const skill = person.skills.find(s => s.name === this.skillName);

    if (skill === undefined)
      return false;

    return skill.skillLevel >= this.minimumExperience;
  }

  copy(): PersonConstraint {
    const newConstraint = new ExperiencePersonConstraint();
    newConstraint.minimumExperience = this.minimumExperience;
    newConstraint.skillName = this.skillName;
    return newConstraint;
  }
}
