import { ConstraintFunction, SelectData, SelectGroup } from './constraint-function';
import { Operator } from '../constraints/constraint-utils';
import { Gender } from 'src/app/api/models';

export class GenderConstraintFunction extends ConstraintFunction {
  override getConstraintFunction(): string {
    throw new Error('Method not implemented.');
  }
  override getProperties(): SelectGroup {
    return { id: 'gender', name: 'Gender', values: [{ value: `${this.id}<#>gender`, name: 'Gender' }] };
  }
  override getValues(): SelectData[] {
    return Object.values(Gender).map(gender => ({ value: gender, name: gender }));
  }
  override getOperators(): SelectData[] {
    const operators = [Operator.EQUALS, Operator.NOT_EQUALS];
    return operators.map(operator => ({ value: operator, name: operator }));
  }
}
