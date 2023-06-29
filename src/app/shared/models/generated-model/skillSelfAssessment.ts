import { Skill } from '../skill';
import { SkillLevel } from './skillLevel';

// self assessment by a specific student in a referenced skill
export class SkillSelfAssessment {
    constructor(
      public skill: Skill, // ID referencing a specific skill
      public skillLevel: SkillLevel, // proficiency in the skill as estimated and reported by the student
      public skillLevelRationale: string // explanation of why they assigned themselves the skill level
    ) {}
}