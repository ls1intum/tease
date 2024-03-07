import { Comparator, Operator } from '../../constraints-2/constraint-utils';
import { StudentConstraintFunction } from './student-constraint-function';

export class NationalityConstraintFunction extends StudentConstraintFunction {
  constructor(operator: Operator.EQUALS | Operator.NOT_EQUALS, value: string) {
    super('nationality', operator, value);
  }

  fulfillsConstraint(value: string): boolean {
    return Comparator[this.operator](this.value, value);
  }
}
