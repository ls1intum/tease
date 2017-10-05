import {Team} from './team';
import {Language} from './language';
import {Skill, SkillLevel} from './skill';
import {Device, DeviceType} from './device';
import {CsvValueNames} from "../constants/csv.constants";
/**
 * Created by wanur on 05/11/2016.
 */

export class Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  iosDevExp: string;
  iosDevExpDescription: string;
  gitExpDescription: string;
  generalComments: string;
  skills: Skill[] = [];
  languages: Language[] = [];
  devices: Device[] = [];
  gender: Gender = Gender.Male;
  germanLanguageLevel: string;
  englishLanguageLevel: string;

  currentTerm: number;
  major: string;
  tumId: string;

  team: Team;
  teamPriorities: Team[] = [];

  supervisorRating: SkillLevel;

  // used internally for preserving initial ordering
  orderId: number;

  constructor(id?: number, firstName?: string) {
    this.id = id || 0;
    this.firstName = firstName || 'no name';
  }

  getTeamPriority(team: Team): number {
    return this.teamPriorities.indexOf(team) + 1;
  }

  addDevice(device: Device) {
    this.devices.push(device);
  }

  addSkill(skillName: string, skillType: string, skillLevel: SkillLevel) {
    this.skills.push(new Skill(skillName, skillType, skillLevel));
  }

  ownsDevice(deviceType: DeviceType): boolean {
    return this.devices.filter(d => d.deviceType === deviceType).length > 0;
  }

  hasSupervisorRating(): boolean {
    return this.supervisorRating !== undefined && this.supervisorRating !== SkillLevel.None;
  }

  getiOSSkillLevel(): SkillLevel {
    const iOSSkillLevel = Person.IOSDevExperienceAnswerToSkillLevelMap.get(this.iosDevExp);
    return iOSSkillLevel ? iOSSkillLevel : SkillLevel.None;
  }

  static readonly IOSDevExperienceAnswerToSkillLevelMap = new Map([
    [CsvValueNames.iOSDevExperienceLow, SkillLevel.Low],
    [CsvValueNames.iOSDevExperienceMedium, SkillLevel.Medium],
    [CsvValueNames.iOSDevExperienceHigh, SkillLevel.High],
    [CsvValueNames.iOSDevExperienceVeryHigh, SkillLevel.VeryHigh],
  ]);

  /*
    {
    CsvValueNames.iOSDevExperienceLow : SkillLevel.Medium,
    "sample2": 2
  };*/
}

export enum Gender {
  Male,
  Female
}
