import {SkillLevel} from "../models/skill";
/**
 * Created by Malte Bucksch on 16/12/2016.
 */

export abstract class Colors {
  static getColor(skillLevel: SkillLevel): string {
    switch(skillLevel){
      case SkillLevel.VeryHigh:
        return "#4a9ddd";
      case SkillLevel.High:
        return "#4EAE4F";
      case SkillLevel.Medium:
        return "#F39519";
      case SkillLevel.Low:
        return "#E7453A";
      case SkillLevel.None:
        return "#FFFFFF";
    }
  }

  static readonly LightGray = "#E0E0E0";
  static readonly DarkGray = "#424242";
  static readonly ScrollBarButtonColor = "#69f0ae";
}
