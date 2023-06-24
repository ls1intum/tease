import { Constraint, ConstraintType } from './constraint';
import { Project } from '../project';
import { Device } from '../device';
import { ProjectHelper } from '../../helpers/project.helper';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class MacDeviceConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Project): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }

  getName(): string {
    return 'Persons w. Mac';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Project): number {
    return team.getDeviceCountOfType(Device.Mac);
  }
}
