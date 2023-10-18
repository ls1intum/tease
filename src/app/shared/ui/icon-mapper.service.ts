import { SkillLevel } from '../models/skill';
import { Gender } from '../models/person';
import { Device } from '../models/device';
import { MD5 } from 'crypto-js';
/**
 * Created by Malte Bucksch on 10/12/2016.
 */

export class IconMapperService {
  private static readonly BASE_PATH_IMAGES = '/assets/images/';
  private static readonly GRAVATAR_URL = 'http://www.gravatar.com/avatar/';

  static getSkillIconPath(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.VeryHigh:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_very_high.png';
      case SkillLevel.High:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_high.png';
      case SkillLevel.Medium:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_medium.png';
      case SkillLevel.Low:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_low.png';
      case SkillLevel.None:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_not_rated.png';
    }
  }

  static getDeviceTypeIconPath(device: Device): string {
    switch (device) {
      case Device.Iphone:
        return IconMapperService.BASE_PATH_IMAGES + 'iphone.png';
      case Device.Ipad:
        return IconMapperService.BASE_PATH_IMAGES + 'ipad.png';
      case Device.IphoneAR:
        return IconMapperService.BASE_PATH_IMAGES + 'iphoneAR.png';
      case Device.IpadAR:
        return IconMapperService.BASE_PATH_IMAGES + 'ipadAR.png';
      case Device.Watch:
        return IconMapperService.BASE_PATH_IMAGES + 'iwatch.png';
      case Device.Mac:
        return IconMapperService.BASE_PATH_IMAGES + 'mac.png';
    }
  }

  static getGenderIconPath(gender: Gender): string {
    switch (gender) {
      case Gender.Male:
        return IconMapperService.BASE_PATH_IMAGES + 'mars.svg';
      case Gender.Female:
        return IconMapperService.BASE_PATH_IMAGES + 'venus.svg';
    }
  }

  static getGravatarIcon(email: string, size = 200): string {
    if (!email) return IconMapperService.GRAVATAR_URL;
    const emailHash = MD5(email).toString();
    return IconMapperService.GRAVATAR_URL + emailHash + '?s=' + size.toString() + '&d=mm';
  }
}
