import {PersonSerializer} from '../layers/data-access-layer/serialization/PersonSerializer';
import {CsvValueNames} from '../constants/csv.constants';
/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Skill {
  skillName: string;
  private _skillLevel: SkillLevel;
  private _interestLevel: SkillLevel;

  public static getLabelForSkillLevel(skillLevel: SkillLevel) {
    switch (skillLevel) {
      case SkillLevel.Low:
        return 'Novice';
      case SkillLevel.Medium:
        return 'Intermediate';
      case SkillLevel.High:
        return 'Advanced';
      case SkillLevel.VeryHigh:
        return 'Expert';
    }

    return 'Not rated';
  }

  constructor(name: string, skillLevel: SkillLevel) {
    this.skillName = name;
    this._skillLevel = skillLevel;
  }

  get skillLevel(): SkillLevel {
    return this._skillLevel;
  }

  get interestLevel(): SkillLevel {
    return this._interestLevel;
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


