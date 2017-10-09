import {Team} from './team';
import {Language} from './language';
import {Skill, SkillLevel} from './skill';
import {Device} from './device';
import {CsvValueNames} from '../constants/csv.constants';
/**
 * Created by wanur on 05/11/2016.
 */

export class Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  tumId: string;
  gender: Gender;
  major: string;
  semester: number;

  germanLanguageLevel: string;
  englishLanguageLevel: string;

  iosDev: string;
  appStoreLink: string;
  iOSDevExplained: string;

  introAssessment: String;
  devices: Device[] = [];

  skills: Skill[] = [];

  gitExpDescription: string;
  generalComments: string;

  languages: Language[] = [];


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

  ownsDevice(device: Device): boolean {
    return this.devices.includes(device);
  }

  hasSupervisorRating(): boolean {
    return this.supervisorRating !== undefined && this.supervisorRating !== SkillLevel.None;
  }

  getiOSSkillLevel(): SkillLevel {
    const iOSSkillLevel = Person.IOSDevExperienceAnswerToSkillLevelMap.get(this.iosDev);
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
