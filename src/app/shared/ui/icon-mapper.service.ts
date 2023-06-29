import { Injectable } from '@angular/core';
import { SkillLevel } from '../models/generated-model/skillLevel';
import { Gender } from '../models/generated-model/gender';
import { Device } from '../models/device';
import { Md5 } from 'ts-md5/dist/md5';

export class IconMapperService {
  private static readonly BASE_PATH_IMAGES = '/assets/images/';
  private static readonly GRAVATAR_URL = 'https://www.gravatar.com/avatar/';

  constructor() {}

  static getSkillIconPath(skillLevel: SkillLevel): string {
    switch (skillLevel) {
      case SkillLevel.Expert:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_very_high.png';
      case SkillLevel.Advanced:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_high.png';
      case SkillLevel.Intermediate:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_medium.png';
      case SkillLevel.Novice:
        return IconMapperService.BASE_PATH_IMAGES + 'skill_low.png';
      default:
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
      default:
         // TODO: create separate images for remaining gender options
        return IconMapperService.BASE_PATH_IMAGES + 'venus.svg';
    }
  }

  static getGravatarIcon(email: string, size = 200): string {
    if (email === undefined) return IconMapperService.GRAVATAR_URL;

    const emailHash = Md5.hashStr(email);
    return IconMapperService.GRAVATAR_URL + emailHash + '?s=' + size.toString() + '&d=mm';
  }
}
