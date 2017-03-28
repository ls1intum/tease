import {PersonSerializer} from "../layers/data-access-layer/serialization/PersonSerializer";
import {CsvValueNames} from "../constants/csv.constants";
/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Skill {
  private _skillLevel: SkillLevel;
  skillName: string;
  skillType: string;

  constructor(skill: string, skillType: string, skillLevel: SkillLevel) {
    this.skillName = skill;
    this._skillLevel = skillLevel;
    this.skillType = skillType;
  }

  get skillLevel(): SkillLevel {
    return this._skillLevel;
  }

  toString(): string {
    return CsvValueNames.SkillLevelValue[SkillLevel[this.skillLevel]];
  }
}

export enum SkillLevel {
  VeryHigh,
  High,
  Medium,
  Low,
  None
}


