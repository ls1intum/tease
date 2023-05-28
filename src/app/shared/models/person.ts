import { Team } from './team';
import { Language } from './language';
import { Skill, SkillLevel } from './skill';
import { Device } from './device';
import { CSVConstants } from '../constants/csv.constants';
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
  nationality: string;
  major: string;
  semester: number;

  germanLanguageLevel: string;
  englishLanguageLevel: string;

  introAssessment: string;
  introAssessmentTutor: string;
  devices: Device[] = [];
  skills: Skill[] = [];
  otherSkills: string;
  teamPriorities: Team[] = [];

  studentComments: string;
  supervisorRating: SkillLevel;

  tutorComments: string;

  // reverse reference
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
//     const iOSSkillLevel = Person.IOSDevExperienceAnswerToSkillLevelMap.get(this.iosDev);
//     return iOSSkillLevel !== undefined ? iOSSkillLevel : SkillLevel.None;

    // returning placeholder value while transform model
    // iOS skill level should be retrieved from the iOS skill in the skills array
    return SkillLevel.Low;
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
  Female,
}
