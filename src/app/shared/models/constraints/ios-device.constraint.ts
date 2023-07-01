import { Constraint, ConstraintType } from './constraint';
import { DeviceType } from '../generated-model/device';
import { Team } from '../team';

export class IosDeviceConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }
  
  private getDeviceCount(team: Team): number {
    return (
      team.getDeviceCountOfType(DeviceType.IPhone) +
      team.getDeviceCountOfType(DeviceType.IPad)
    );
  }

  getName(): string {
    return 'Students w. iDevice';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Team): number {
    return this.getDeviceCount(team);
  }
}
