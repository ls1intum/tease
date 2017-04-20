import {Constraint, ConstraintType} from "./constraint";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class IosDeviceConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  getName(): string {
    return "iOS Devices";
  }

  getType(): ConstraintType {
    return ConstraintType.GTE;
  }

}
