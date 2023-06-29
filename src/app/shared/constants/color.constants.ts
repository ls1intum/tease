import { SkillLevel } from '../models/generated-model/skillLevel';

export abstract class Colors {
  static readonly LightGray = '#E0E0E0';
  static readonly DarkGray = '#424242';
  static readonly ScrollBarButtonColor = '#69f0ae';

  static getColor(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.Expert:
        return '#5eb7e0';
      case SkillLevel.Advanced:
        return '#60c460';
      case SkillLevel.Intermediate:
        return '#f7b551';
      case SkillLevel.Novice:
        return '#f47f67';
      default:
        return '#a4a4a4';
    }
  }
}
