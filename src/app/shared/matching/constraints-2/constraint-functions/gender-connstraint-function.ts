import { ConstraintFunction, SelectData, SelectGroup } from './constraint-function';
import { Operator, mapTwoValues, Comparator } from '../constraint-utils';
import { Gender } from 'src/app/api/models';

export class GenderConstraintFunction extends ConstraintFunction {
  override getConstraintFunction(projectId: string, property: string, operator: Operator, value: string): string {
    return this.combineStudentAndProjects(
      projectId,
      this.students.filter(student => Comparator[operator](value, student.gender))
    );
  }

  override getProperties(): SelectGroup {
    return { name: 'Gender', values: [{ value: mapTwoValues(this.id, 'gender'), name: 'Gender' }] };
  }

  override getValues(): SelectData[] {
    return Object.values(Gender).map(gender => ({ value: gender, name: gender }));
  }

  override getOperators(): SelectData[] {
    const operators = [Operator.EQUALS, Operator.NOT_EQUALS];
    return operators.map(operator => ({ value: operator, name: operator }));
  }
}
