import {Constraint} from "./constraint";
import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class TeamSizeConstraint extends Constraint {
  maximumCount: number;

  constructor(maximumCount: number) {
    super();

    this.maximumCount = maximumCount;
  }

  isSatisfied(team: Team): boolean {
    return team.persons.length <= this.maximumCount;
  }

  calculateSatisfactionScore(team: Team): number {
    let teamSize = this.getTeamSize(team);

    // TODO NOW make more sophisticated

    return this.isSatisfied(team) ? 10 : 0;
  }

  private getTeamSize(team: Team) {
    return team.persons.length;
  }

  getValue(): number {
    return this.maximumCount;
  }

  getName(): string {
    return "Team Size";
  }

  getComparator(): string {
    return "<=";
  }

  setValue(value: number) {
    this.maximumCount = value;
  }
}
