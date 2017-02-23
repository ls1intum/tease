import {Constraint} from "./constraint";
import {Team} from "../team";
import {DeviceType} from "../device";
import {TeamHelper} from "../../helpers/team.helper";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

class DeviceConstraint extends Constraint {
  deviceType: DeviceType;
  minimumCount: number;

  toString(): string {
    return this.deviceType.toString() + " number >= " + this.minimumCount;
  }

  isSatisfied(team: Team): boolean {
    return this.getDeviceCountOfType(team) >= this.minimumCount;
  }

  private getDeviceCountOfType(team: Team): number {
    return team.persons
      .map(person => TeamHelper.getDevicesOfType(person.devices, this.deviceType).length)
      .reduce((sum, count) => sum + count);
  }

  calculateSatisfactionScore(team: Team): number {
    let deviceCount = this.getDeviceCountOfType(team);

    // TODO NOW make more sophisticated

    return this.isSatisfied(team) ? 10 : 0;
  }

}
