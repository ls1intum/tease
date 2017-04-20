import {Constraint, ConstraintType} from "./constraint";

export class SkillExpertConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  getName(): string {
    return "#Experts";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
