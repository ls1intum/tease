import { StudentSerializer } from '../layers/data-access-layer/student-serializer';
import { CSVConstants } from '../constants/csv.constants';
/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Skill {
  private _name: string;
  private _description: string;
  private _skillLevel: SkillLevel;
  private _skillLevelRationale: string;

  public static getLabelForSkillLevel(skillLevel: SkillLevel): string {
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

  public static getLabelForSelfAssessmentLevel(skillLevel: SkillLevel): string {
    switch(skillLevel) {
      case SkillLevel.Low:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.Low;
      case SkillLevel.Medium:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.Medium;
      case SkillLevel.High:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.High;
      case SkillLevel.VeryHigh:
        return CSVConstants.Student.IntroSelfAssessmentAnswers.VeryHigh;
    }

    return CSVConstants.Student.IntroSelfAssessmentAnswers.None;
  }

  constructor(name: string, description: string, skillLevel: SkillLevel, skillLevelRationale: string) {
    this._name = name;
    this._description = description;
    this._skillLevel = skillLevel;
    this._skillLevelRationale = skillLevelRationale;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get skillLevel(): SkillLevel {
    return this._skillLevel;
  }

  get skillLevelRationale(): string {
    return this._skillLevelRationale;
  }

  toString(): string {
    return CSVConstants.SkillLevelValue[SkillLevel[this.skillLevel]];
  }
}

export enum SkillLevel {
  None = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  VeryHigh = 4,
}
