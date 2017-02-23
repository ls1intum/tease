import {Team} from "../team";
import {Constraint} from "./constraint";
import {TeamHelper} from "../../helpers/team.helper";
import {DeviceType} from "../device";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class IosDeviceConstraint extends Constraint {
  minimumCount: number;

  constructor(minimumCount: number) {
    super();

    this.minimumCount = minimumCount;
  }

  toString(): string {
    return "iOS devices >= " + this.minimumCount;
  }

  isSatisfied(team: Team): boolean {
    return this.getDeviceCount(team) >= this.minimumCount;
  }

  private getDeviceCount(team: Team): number {
    return this.calculateDeviceCountOfType(team, DeviceType.Iphone) + this.calculateDeviceCountOfType(team, DeviceType.Ipad);
  }

  private calculateDeviceCountOfType(team: Team, deviceType: DeviceType) {
    return team.persons
      .map(person => TeamHelper.getDevicesOfType(person.devices, deviceType).length)
      .reduce((sum, count) => sum + count);
  }

  calculateSatisfactionScore(team: Team): number {
    let deviceCount = this.getDeviceCount(team);

    // TODO NOW make more sophisticated

    return this.isSatisfied(team) ? 10 : 0;
  }

  getValue(): number {
    return this.minimumCount;
  }
}
