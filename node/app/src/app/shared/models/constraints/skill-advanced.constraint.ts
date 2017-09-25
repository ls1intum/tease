import {Constraint, ConstraintType} from './constraint';
import {Team} from '../team';
import {TeamHelper} from '../../helpers/team.helper';
import {SkillLevel} from '../skill';

export class SkillAdvancedConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    const count = TeamHelper.getPersonsOfSkillLevelInTeam(team, SkillLevel.High);
    return (this.getMinValue() || 0) <= count && count <= (this.getMaxValue() || Number.MAX_VALUE);
  }

  getName(): string {
    return '#Advanced';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
