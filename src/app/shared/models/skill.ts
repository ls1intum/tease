/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Skill {
  private skillLevel: SkillLevel;
  private skill: string;

  constructor(skill: string, skillLevel: SkillLevel) {
    this.skill = skill;
    this.skillLevel = skillLevel;
  }
}

enum SkillLevel {
  VeryHigh,
  High,
  Medium,
  Low,
  None
}


