import { Constraint, ConstraintType } from './constraint';
import { Team } from '../team';
import { DeviceType } from '../generated-model/device';

export class MacDeviceConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }

  getName(): string {
    return 'Students w. Mac';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Team): number {
    return team.getDeviceCountOfType(DeviceType.Mac);
  }
}
