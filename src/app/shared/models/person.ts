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
  image: string;
  email: string;
  tumId: string;
  gender: Gender;
  nationality: string;
  studyProgram: string;
  semester: number;

  germanLanguageLevel: string;
  englishLanguageLevel: string;
  introSelfAssessment: string;

  devices: Device[] = [];
  skills: Skill[] = [];
  teamPriorities: Team[] = [];

  studentComments: string;
  supervisorAssessment: SkillLevel;

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

  hasSupervisorAssessment(): boolean {
    return this.supervisorAssessment !== undefined && this.supervisorAssessment !== SkillLevel.None;
  }

  getiOSSkillLevel(): SkillLevel {
//     const iOSSkillLevel = Person.IOSDevExperienceAnswerToSkillLevelMap.get(this.iosDev);
//     return iOSSkillLevel !== undefined ? iOSSkillLevel : SkillLevel.None;

    // returning placeholder value while transforming model
    // iOS skill level should be retrieved from the iOS skill in the skills array
    return SkillLevel.Low;
  }

  getIntroSelfAssessmentLevel(): SkillLevel {
    const index = CSVConstants.Person.IntroSelfAssessmentAnswers.indexOf(this.introSelfAssessment);
    return index >= 0 ? index : null;
  }

  getSupervisorAssessmentLevel(): SkillLevel {
    return this.supervisorAssessment;
  }
}

export enum Gender {
  Male,
  Female,
}
