import {PersonSerializer} from "../layers/data-access-layer/serialization/PersonSerializer";
/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Skill {
  private _skillLevel: SkillLevel;
  skill: string;
  skillType: string;

  constructor(skill: string, skillType: string, skillLevel: SkillLevel) {
    this.skill = skill;
    this._skillLevel = skillLevel;
    this.skillType = skillType;
  }

  get skillLevel(): SkillLevel {
    return this._skillLevel;
  }

  toString(): string {
    return this.skill + ": "+
      this.skillType + " = "+
      PersonSerializer.serializeSkillLevel(this._skillLevel);
  }
}

export enum SkillLevel {
  VeryHigh,
  High,
  Medium,
  Low,
  None
}


