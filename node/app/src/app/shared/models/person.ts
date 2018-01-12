import {Team} from './team';
import {Language} from './language';
import {Skill, SkillLevel} from './skill';
import {Device} from './device';
import {CSVConstants} from '../constants/csv.constants';
/**
 * Created by wanur on 05/11/2016.
 */

export class Person {
  static readonly IOSDevExperienceAnswerToSkillLevelMap = new Map([
    [CSVConstants.iOSDevExperienceLow, SkillLevel.Low],
    [CSVConstants.iOSDevExperienceMedium, SkillLevel.Medium],
    [CSVConstants.iOSDevExperienceHigh, SkillLevel.High],
    [CSVConstants.iOSDevExperienceVeryHigh, SkillLevel.VeryHigh],
  ]);

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

  introAssessment: string;
  introAssessmentTutor: string;
  devices: Device[] = [];
  skills: Skill[] = [];
  otherSkills: String;
  teamPriorities: Team[] = [];

  studentComments: string;
  supervisorRating: SkillLevel;

  tutorComments: String;

  team: Team;

  isPinned: boolean;

  constructor(id?: number, firstName?: string) {
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
    return iOSSkillLevel !== undefined ? iOSSkillLevel : SkillLevel.None;
  }

  getIntroAssessmentLevel(): SkillLevel {
    const index = CSVConstants.Person.IntroAssessmentAnswers.indexOf(this.introAssessment);
    return index >= 0 ? index : null;
  }

  getIntroAssessmentTutorLevel(): SkillLevel {
    const index = CSVConstants.Person.IntroAssessmentTutorAnswers.indexOf(this.introAssessmentTutor);
    return index >= 0 ? index : null;
  }
}

export enum Gender {
  Male,
  Female
}
