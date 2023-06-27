import { Team } from './team';
import { Skill, SkillLevel } from './skill';
import { Device } from './device';
import { CSVConstants } from '../constants/csv.constants';
import { LanguageProficiency } from './generated-model/languageProficiency';
/**
 * Created by wanur on 05/11/2016.
 */

export class Student {
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  studentId: string;
  gender: Gender;
  nationality: string;
  studyProgram: string;
  semester: number;

  germanLanguageLevel: LanguageProficiency;
  englishLanguageLevel: LanguageProficiency;
  introSelfAssessment: SkillLevel;

  devices: Device[] = [];
  skills: Skill[] = [];
  projectPriorities: Team[] = [];

  studentComments: string;
  supervisorAssessment: SkillLevel;
  tutorComments: string;

  isPinned: boolean;

  // reverse reference
  team: Team;

  constructor(id?: number, firstName?: string) {
    this.firstName = firstName || 'no name';
  }

  getTeamPriority(team: Team): number {
    return this.projectPriorities.indexOf(team) + 1;
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

  getiOSSkill(): Skill {
    // TODO: have the iOS skill be hard-coded or forced to always exist due to its signifince or special
    // role in the iPraktikum, instead of a CSV constant store this somewhere else
    return this.skills.find(skill => skill.name === CSVConstants.SkillNameiOS);
  }

  getiOSSkillLevel(): SkillLevel {
    return this.getiOSSkill().skillLevel;
  }

  getIntroSelfAssessmentLevel(): SkillLevel {
    return this.introSelfAssessment;
  }

  getSupervisorAssessmentLevel(): SkillLevel {
    return this.supervisorAssessment;
  }

  getNoniOSSkills(): Array<Skill> {
    return this.skills.filter(skill => skill.name !== CSVConstants.SkillNameiOS);
  }
}

export enum Gender {
  Male,
  Female,
}
