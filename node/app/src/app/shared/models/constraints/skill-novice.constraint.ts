import {Constraint, ConstraintType} from './constraint';
import {Team} from '../team';
import {TeamHelper} from '../../helpers/team.helper';
import {SkillLevel} from '../skill';

export class SkillNoviceConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    const count = TeamHelper.getPersonsOfSkillLevelInTeam(team, SkillLevel.Low);
    return (this.getMinValue() || 0) <= count && count <= (this.getMaxValue() || Number.MAX_VALUE);
  }

  getName(): string {
    return '#Novices';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
