import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export abstract class Constraint {
  abstract isSatisfied(team: Team): boolean;

  abstract calculateSatisfactionScore(team: Team): number;

  abstract getValue(): number;
  abstract setValue(value: number);

  abstract getName(): string;

  abstract getComparator(): string;

  toString(): string {
    return this.getName() + " " + this.getComparator() + " " + this.getValue();
  }
}
