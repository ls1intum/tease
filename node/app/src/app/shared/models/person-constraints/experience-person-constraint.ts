import {PersonConstraint} from './person-constraint';
import {Person} from '../person';
import {SkillLevel} from '../skill';

export class ExperiencePersonConstraint extends PersonConstraint {
  minimumExperience: SkillLevel = SkillLevel.Low;
  skillName: string;

  isFullfilledFor(person: Person): boolean {
    const skill = person.skills.find(s => s.name === this.skillName);

    if (skill === null)
      return false;

    return skill.skillLevel >= this.minimumExperience;
  }
}
