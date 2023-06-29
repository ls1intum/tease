import { Team } from './team';
import { Skill } from './skill';
import { Device } from './device';
import { CSVConstants } from '../constants/csv.constants';
import { LanguageProficiency } from './generated-model/languageProficiency';
import { Gender } from './generated-model/gender';
import { SkillLevel } from './generated-model/skillLevel';
import { SkillSelfAssessment } from './generated-model/skillSelfAssessment';

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
  skills: SkillSelfAssessment[] = [];
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
    this.germanLanguageLevel;
  }

  ownsDevice(device: Device): boolean {
    return this.devices.includes(device);
  }

  hasSupervisorAssessment(): boolean {
    return this.supervisorAssessment !== undefined;
  }

  getiOSSkillSelfAssessment(): SkillSelfAssessment {
    // TODO: have the iOS skill be hard-coded or forced to always exist due to its signifince or special
    // role in the iPraktikum, instead of a CSV constant store this somewhere else
    return this.skills.find(assessment => assessment.skill.id === CSVConstants.SkillIdiOS);
  }

  getiOSSkillLevel(): SkillLevel {
    return this.getiOSSkillSelfAssessment().skillLevel;
  }

  getIntroSelfAssessmentLevel(): SkillLevel {
    return this.introSelfAssessment;
  }

  getSupervisorAssessmentLevel(): SkillLevel {
    return this.supervisorAssessment;
  }

  getNoniOSSkillSelfAssessments(): Array<SkillSelfAssessment> {
    return this.skills.filter(skill => skill.skill.id !== CSVConstants.SkillIdiOS);
  }
}
