import { Constraint, ConstraintType } from './constraint';
import { Device } from '../device';
import { Project } from '../project';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class IosDeviceConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Project): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }

  private getDeviceCount(team: Project): number {
    return (
      team.getDeviceCountOfType(Device.Iphone) +
      team.getDeviceCountOfType(Device.Ipad) +
      team.getDeviceCountOfType(Device.IphoneAR) +
      team.getDeviceCountOfType(Device.IpadAR)
    );
  }

  getName(): string {
    return 'Persons w. iDevice';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Project): number {
    return this.getDeviceCount(team);
  }
}
