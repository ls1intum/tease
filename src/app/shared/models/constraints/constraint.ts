import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export abstract class Constraint {
  isEnabled = true;

  abstract isSatisfied(team: Team): boolean;

  /*isEnabled():boolean {
    // return this.getValue() != Constraint.DISABLED_VALUE;
    return this.isEnabled;
  }
  setEnabled(isEnabled: boolean) {
    // let newValue =
    //   this.getValue() == Constraint.DISABLED_VALUE ? 1 : this.getValue();
    // this.setValue(isEnabled ? newValue : Constraint.DISABLED_VALUE);
    this.isEnabled = isEnabled;
  }*/

  abstract calculateSatisfactionScore(team: Team): number;

  abstract getValue(): number;
  abstract setValue(value: number);

  abstract getName(): string;

  abstract getComparator(): string;

  toString(): string {
    return this.getName() + " " + this.getComparator() + " " + this.getValue();
  }
}
