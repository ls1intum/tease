import {Constraint, ConstraintType} from "./constraint";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class TeamSizeConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  getName(): string {
    return "Team Size";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
