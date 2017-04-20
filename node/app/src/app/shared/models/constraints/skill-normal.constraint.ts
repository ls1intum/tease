import {Constraint, ConstraintType} from "./constraint";

export class SkillNormalConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  getName(): string {
    return "#Normal";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
