import {Constraint, ConstraintType} from './constraint';
import {Team} from '../team';
import {Device} from '../device';
import {TeamHelper} from '../../helpers/team.helper';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export class MacDeviceConstraint extends Constraint {

  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return this.getCurrentValue(team) >= this.minValue;
  }

  getName(): string {
    return 'Persons w. Mac';
  }

  getType(): ConstraintType {
    return ConstraintType.GTE;
  }

  getCurrentValue(team: Team): number {
    return team.getDeviceCountOfType(Device.Mac);
  }
}
