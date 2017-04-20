import {Constraint, ConstraintType} from "./constraint";
import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class TeamSizeConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return (this.minValue || 0) <= team.persons.length && team.persons.length <= (this.maxValue || Number.MAX_VALUE);
  }

  getName(): string {
    return "Team Size";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

}
