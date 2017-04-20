import {Constraint, ConstraintType} from "./constraint";

export class SkillNoviceConstraint extends Constraint {

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
