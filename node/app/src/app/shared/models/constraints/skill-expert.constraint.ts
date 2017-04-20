import {Constraint, ConstraintType} from "./constraint";
import {Team} from "../team";
import {TeamHelper} from "../../helpers/team.helper";
import {SkillLevel} from "../skill";

export class SkillExpertConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    let count = TeamHelper.getPersonsOfSkillLevelInTeam(team, SkillLevel.VeryHigh);
    return (this.getMinValue() || 0) <= count && count <= (this.getMaxValue() || Number.MAX_VALUE);
  }

  getName(): string {
    return "#Experts";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
