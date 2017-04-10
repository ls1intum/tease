import {Constraint} from "../../models/constraints/constraint";
import {ConstraintAccessService} from "./constraint.access.service";
import {FemalePersonConstraint} from "../../models/constraints/female-person.constraint";
import {TeamSizeConstraint} from "../../models/constraints/team-size.constraint";
import {IosDeviceConstraint} from "../../models/constraints/ios-device.constraint";
import {MacDeviceConstraint} from "../../models/constraints/mac-device.constraint";

/**
 * Created by Malte Bucksch on 23/02/2017.
 */
export class KeyValueConstraintAccessService extends ConstraintAccessService {
  private static readonly KeyMacDeviceConstraint = "KeyMacDeviceConstraint";
  private static readonly KeyIosDeviceConstraint = "KeyIosDeviceConstraint";
  private static readonly KeyFemalePersonConstraint = "KeyFemalePersonConstraint";
  private static readonly KeyTeamSizeConstraint = "KeyTeamSizeConstraint";

  private serializeConstraint(constraint: Constraint): string {
    return JSON.stringify(constraint);
  }

  private unserializeConstraint(constraint: string): {} {
    return JSON.parse(constraint);
  }

  saveConstraint(constraint: Constraint) {

    if (constraint instanceof IosDeviceConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyIosDeviceConstraint, this.serializeConstraint(constraint));
      return;
    }

    if (constraint instanceof MacDeviceConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyMacDeviceConstraint, this.serializeConstraint(constraint));
      return;
    }

    if (constraint instanceof FemalePersonConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyFemalePersonConstraint, this.serializeConstraint(constraint));
      return;
    }

    if (constraint instanceof TeamSizeConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyTeamSizeConstraint, this.serializeConstraint(constraint));
      return;
    }
  }

  fetchConstraints(): Constraint[] {
    let constraints: Constraint[] = [];

    constraints.push(new MacDeviceConstraint(
      this.unserializeConstraint(localStorage.getItem(KeyValueConstraintAccessService.KeyMacDeviceConstraint))));
    constraints.push(new IosDeviceConstraint(
      this.unserializeConstraint(localStorage.getItem(KeyValueConstraintAccessService.KeyIosDeviceConstraint))));
    constraints.push(new FemalePersonConstraint(
      this.unserializeConstraint(localStorage.getItem(KeyValueConstraintAccessService.KeyFemalePersonConstraint))));
    let teamSizeConstraint = new TeamSizeConstraint(
      this.unserializeConstraint(localStorage.getItem(KeyValueConstraintAccessService.KeyTeamSizeConstraint)));
    constraints.push(teamSizeConstraint);

    return constraints;
  }
}
