import {Constraint, ConstraintType} from "./constraint";
import {Team} from "../team";
import {Gender} from "../person";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */
export class FemalePersonConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return this.getFemalesPersonsInTeam(team) >= this.minValue;
  }

  private getFemalesPersonsInTeam(team: Team) {
    return team.persons.filter(person => person.gender == Gender.Female).length;
  }

  calculateSatisfactionScore(team: Team): number {
    let femaleCount = this.getFemalesPersonsInTeam(team);

    // TODO NOW make more sophisticated

    return this.isSatisfied(team) ? 10 : 0;
  }

  getName(): string {
    return "Female Persons";
  }

  getType(): ConstraintType {
    return ConstraintType.GTE;
  }

  toString(): string {
    return this.getName() + " " + this.getComparator() + " " + this.getMinValue();
  }

}
