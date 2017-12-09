import {Constraint, ConstraintType} from './constraint';
import {Device} from '../device';
import {Team} from '../team';
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
    return team.getDeviceCountOfType(Device.Iphone) + team.getDeviceCountOfType(Device.Ipad);
  }

  getName(): string {
    return 'iOS Devices';
  }

  getType(): ConstraintType {
    return ConstraintType.GTE;
  }

  getCurrentValue(team: Team): number {
    return this.getDeviceCount(team);
  }
}
