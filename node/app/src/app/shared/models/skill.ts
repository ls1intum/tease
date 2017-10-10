import {PersonSerializer} from '../layers/data-access-layer/serialization/PersonSerializer';
import {CsvValueNames} from '../constants/csv.constants';
/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Skill {
  private _name: string;
  private _skillLevel: SkillLevel;
  private _interestLevel: SkillLevel;
  private _justification: string;

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

  constructor(name: string, skillLevel: SkillLevel, interestLevel: SkillLevel, justification: string) {
    this._name = name;
    this._skillLevel = skillLevel;
    this._interestLevel = interestLevel;
    this._justification = justification;
  }

  get name(): string {
    return this._name;
  }

  get skillLevel(): SkillLevel {
    return this._skillLevel;
  }

  get interestLevel(): SkillLevel {
    return this._interestLevel;
  }

  get justification(): string {
    return this._justification;
  }

  toString(): string {
    return CsvValueNames.SkillLevelValue[SkillLevel[this.skillLevel]];
  }
}

export enum SkillLevel {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  VeryHigh = 4
}


