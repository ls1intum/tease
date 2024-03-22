import { ConstraintFunction, PropertySelectGroup, SelectData } from './constraint-function';
import { Operator, Comparator } from '../constraint-utils';
import { Gender, Student, Skill } from 'src/app/api/models';

export class GenderConstraintFunction extends ConstraintFunction {
  constructor(students: Student[], skills: Skill[]) {
    super(students, skills, [Operator.EQUALS, Operator.NOT_EQUALS]);
  }

  override filterStudentsByConstraintFunction(property: string, operator: Operator, value: string): Student[] {
    return this.students.filter(student => Comparator[operator](value, student.gender));
  }

  override getProperties(): PropertySelectGroup {
    return { name: 'Gender', constraintFunction: this, values: [{ id: 'cf-gender', name: 'Gender' }] };
  }

  override getValues(): SelectData[] {
    return Object.values(Gender).map(gender => ({ id: gender, name: gender }));
  }
}
