import {Constraint} from "../../models/constraints/constraint";
import {ConstraintAccessService} from "./constraint.access.service";
import {FemalePersonConstraint} from "../../models/constraints/female-person.constraint";
import {TeamSizeConstraint} from "../../models/constraints/team-size.constraint";
import {DeviceType} from "../../models/device";
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

  saveConstraint(constraint: Constraint) {
    if (constraint instanceof IosDeviceConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyIosDeviceConstraint,String(constraint.getValue()))
      return;
    }

    if (constraint instanceof MacDeviceConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyMacDeviceConstraint,String(constraint.getValue()))
      return;
    }

    if (constraint instanceof FemalePersonConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyFemalePersonConstraint,String(constraint.getValue()))
      return;
    }

    if (constraint instanceof TeamSizeConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyTeamSizeConstraint,String(constraint.getValue()))
      return;
    }
  }

  fetchConstraints(): Constraint[] {
    let constraints: Constraint[] = [];

    constraints.push(new MacDeviceConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyMacDeviceConstraint,2)));
    constraints.push(new IosDeviceConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyIosDeviceConstraint,2)));
    constraints.push(new FemalePersonConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyFemalePersonConstraint,2)));
    constraints.push(new TeamSizeConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyTeamSizeConstraint,10)));

    return constraints;
  }

  private fetchSavedNumberValue(key: string, fallbackValue): number {
    let value = localStorage.getItem(key);
    // debugger;
    return value === undefined || value === "0" ? fallbackValue : +value;
  }
}
