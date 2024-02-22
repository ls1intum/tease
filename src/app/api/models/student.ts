/* tslint:disable */
/* eslint-disable */
import { Comment } from '../models/comment';
import { Device } from '../models/device';
import { Gender } from '../models/gender';
import { Language } from '../models/language';
import { ProjectPreference } from '../models/project-preference';
import { SkillProficiency } from '../models/skill-proficiency';
import { StudentSkill } from '../models/student-skill';

/**
 * A person enrolled in the iPraktikum course at TUM
 */
export interface Student {
  devices: Array<Device>;
  email: string;
  firstName: string;
  gender: Gender;
  id: string;
  introCourseProficiency: SkillProficiency;
  introSelfAssessment: SkillProficiency;
  languages: Array<Language>;
  lastName: string;
  nationality: string;
  projectPreferences: Array<ProjectPreference>;
  semester: number;
  skills: Array<StudentSkill>;
  studentComments: Array<Comment>;
  studyDegree: string;
  studyProgram: string;
  tutorComments: Array<Comment>;
}
