import {Constraint, ConstraintType} from "./constraint";

export class SkillAdvancedConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  getName(): string {
    return "#Advanced";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
