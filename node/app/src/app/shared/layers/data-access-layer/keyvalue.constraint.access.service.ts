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

  private static readonly DISABLED_VALUE = "DISABLED_VALUE";
  private static readonly DISABLED_NUMBER_VALUE = -1;

  saveConstraint(constraint: Constraint) {
    if (constraint instanceof IosDeviceConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyIosDeviceConstraint,this.getPersistentValue(constraint));
      return;
    }

    if (constraint instanceof MacDeviceConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyMacDeviceConstraint,this.getPersistentValue(constraint));
      return;
    }

    if (constraint instanceof FemalePersonConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyFemalePersonConstraint,this.getPersistentValue(constraint));
      return;
    }

    if (constraint instanceof TeamSizeConstraint) {
      localStorage.setItem(KeyValueConstraintAccessService.KeyTeamSizeConstraint,this.getPersistentValue(constraint));
      return;
    }
  }

  private getPersistentValue(constraint: Constraint) {
    return constraint.isEnabled ? String(constraint.getValue()) : "DISABLED_VALUE";
  }

  fetchConstraints(): Constraint[] {
    let constraints: Constraint[] = [];

    constraints.push(new MacDeviceConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyMacDeviceConstraint,2)));
    constraints.push(new IosDeviceConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyIosDeviceConstraint,2)));
    constraints.push(new FemalePersonConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyFemalePersonConstraint,2)));
    let teamSizeConstraint = new TeamSizeConstraint(
      this.fetchSavedNumberValue(KeyValueConstraintAccessService.KeyTeamSizeConstraint,10));
    constraints.push(teamSizeConstraint);

    constraints.forEach(constraint => {
      if(constraint.getValue() == KeyValueConstraintAccessService.DISABLED_NUMBER_VALUE) {
        constraint.isEnabled = false;
        constraint.setValue(1);
      }
    });

    return constraints;
  }

  private fetchSavedNumberValue(key: string, fallbackValue): number {
    let value = localStorage.getItem(key);

    if(value === KeyValueConstraintAccessService.DISABLED_VALUE){
      return KeyValueConstraintAccessService.DISABLED_NUMBER_VALUE;
    }

    return (value === undefined || value === "0") ? fallbackValue : +value;
  }
}
