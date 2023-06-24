import { Constraint, ConstraintType } from './constraint';
import { Project } from '../project';
import { ProjectHelper } from '../../helpers/project.helper';
import { Skill, SkillLevel } from '../skill';

export class SkillNoviceConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Project): boolean {
    const count = this.getCurrentValue(team);
    return (this.getMinValue() || 0) <= count && count <= (this.getMaxValue() || Number.MAX_VALUE);
  }

  getName(): string {
    return Skill.getLabelForSkillLevel(SkillLevel.Low);
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Project): number {
    return ProjectHelper.getPersonsOfSkillLevelInTeam(team, SkillLevel.Low);
  }
}
