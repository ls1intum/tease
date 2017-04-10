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
    return team.persons.length <= this.minValue;
  }

  calculateSatisfactionScore(team: Team): number {
    // TODO NOW make more sophisticated

    return this.isSatisfied(team) ? 10 : 0;
  }

  getName(): string {
    return "Team Size";
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }
}
