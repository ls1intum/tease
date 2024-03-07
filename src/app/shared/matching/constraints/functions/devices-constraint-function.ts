import { StudentConstraintFunction } from './student-constraint-function';
import { Comparator, Operator } from '../../constraints-2/constraint-utils';
import { Device } from 'src/app/api/models';

export class DevicesConstraintFunction extends StudentConstraintFunction {
  constructor(operator: Operator.EQUALS | Operator.NOT_EQUALS, value: Device) {
    super('devices', operator, value);
  }

  fulfillsConstraint(values: string[]): boolean {
    for (const value of values) {
      if (Comparator[this.operator](this.value, value)) {
        return true;
      }
    }
    return false;
  }
}
