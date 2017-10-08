import {SkillLevel} from '../models/skill';
/**
 * Created by Malte Bucksch on 16/12/2016.
 */

export abstract class Colors {
  static readonly LightGray = '#E0E0E0';
  static readonly DarkGray = '#424242';
  static readonly ScrollBarButtonColor = '#69f0ae';

  static getColor(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.VeryHigh:
        return '#5eb7e0';
      case SkillLevel.High:
        return '#60c460';
      case SkillLevel.Medium:
        return '#f7b551';
      case SkillLevel.Low:
        return '#f47f67';
      case SkillLevel.None:
        return '#a4a4a4';
    }
  }
}
