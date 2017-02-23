import {Constraint} from "./constraint";
import {Team} from "../team";
import {Gender} from "../person";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */
class FemalePersonConstraint extends Constraint {
  minimumCount: number;

  toString(): string {
    return "Female persons >= " + this.minimumCount;
  }

  isSatisfied(team: Team): boolean {
    return this.getFemalesPersonsInTeam(team) >= this.minimumCount;
  }

  private getFemalesPersonsInTeam(team: Team) {
    return team.persons.filter(person => person.gender == Gender.Female).length;
  }

  calculateSatisfactionScore(team: Team): number {
    let femaleCount = this.getFemalesPersonsInTeam(team);

    // TODO NOW make more sophisticated

    return this.isSatisfied(team) ? 10 : 0;
  }

}
