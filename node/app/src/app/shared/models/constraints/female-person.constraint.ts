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

  getName(): string {
    return "Female Persons";
  }

  getType(): ConstraintType {
    return ConstraintType.GTE;
  }

}
