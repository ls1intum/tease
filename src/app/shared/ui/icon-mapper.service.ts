import {Injectable} from "@angular/core";
import {SkillLevel} from "../models/skill";
import {Gender} from "../models/person";
/**
 * Created by Malte Bucksch on 10/12/2016.
 */

@Injectable()
export class IconMapperService {
  private static readonly BASE_PATH_IMAGES = "../../../assets/images/";

  constructor() { }

  getSkillIcon(skillLevel: SkillLevel){
    switch (skillLevel){
      case SkillLevel.VeryHigh:
        return IconMapperService.BASE_PATH_IMAGES+"skill_very_high.png";
      case SkillLevel.High:
        return IconMapperService.BASE_PATH_IMAGES+"skill_high.png";
      case SkillLevel.Medium:
        return IconMapperService.BASE_PATH_IMAGES+"skill_medium.png";
      case SkillLevel.Low:
        return IconMapperService.BASE_PATH_IMAGES+"skill_low.png";
      case SkillLevel.None:
        return IconMapperService.BASE_PATH_IMAGES+"skill_not_rated.png";
    }
  }

  getGenderIcon(gender: Gender){
    switch (gender){
      case Gender.Male:
        return IconMapperService.BASE_PATH_IMAGES+"male.png";
      case Gender.Female:
        return IconMapperService.BASE_PATH_IMAGES+"female.png";
    }
  }
}
