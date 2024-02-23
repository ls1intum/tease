import { Comparator, Operator } from '../constraint-utils';
import { StudentConstraintFunction } from './student-constraint-function';

export class GenderConstraintFunction extends StudentConstraintFunction {
  constructor(operator: Operator.EQUALS | Operator.NOT_EQUALS, value: string) {
    super('gender', operator, value);
  }

  fulfillsConstraint(value: string): boolean {
    return Comparator[this.operator](this.value, value);
  }
}
