import { Student } from 'src/app/api/models';
import { StudentConstraintFunction } from './student-constraint-function';
import { Operator } from '../constraint-utils';

export abstract class ObjectConstraintFunction extends StudentConstraintFunction {
  protected constructor(
    key: keyof Student,
    operator: Operator,
    value: string,
    protected readonly object_id: string
  ) {
    super(key, operator, value);
  }
}
