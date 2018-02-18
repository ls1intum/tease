import {Constraint, ConstraintType} from './constraint';
import {Team} from '../team';
import {TeamHelper} from '../../helpers/team.helper';
import {Skill, SkillLevel} from '../skill';

export class SkillNormalConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    const count = this.getCurrentValue(team);
    return (this.getMinValue() || 0) <= count && count <= (this.getMaxValue() || Number.MAX_VALUE);
  }

  getName(): string {
    return Skill.getLabelForSkillLevel(SkillLevel.Medium);
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Team): number {
    return TeamHelper.getPersonsOfSkillLevelInTeam(team, SkillLevel.Medium);
  }
}
