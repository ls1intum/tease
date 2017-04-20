import {Constraint, ConstraintType} from "./constraint";
import {TeamHelper} from "../../helpers/team.helper";
import {DeviceType} from "../device";
import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class IosDeviceConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return this.getDeviceCount(team) >= this.minValue;
  }

  private getDeviceCount(team: Team): number {
    return this.calculateDeviceCountOfType(team, DeviceType.Iphone) + this.calculateDeviceCountOfType(team, DeviceType.Ipad);
  }

  private calculateDeviceCountOfType(team: Team, deviceType: DeviceType) {
    return team.persons
      .map(person => TeamHelper.getDevicesOfType(person.devices, deviceType).length)
      .reduce((sum, count) => sum + count);
  }

  getName(): string {
    return "iOS Devices";
  }

  getType(): ConstraintType {
    return ConstraintType.GTE;
  }

}
