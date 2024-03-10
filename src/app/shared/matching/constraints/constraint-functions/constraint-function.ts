import { Skill, Student } from 'src/app/api/models';
import { Operator, OperatorMapping, mapTwoValues } from '../constraint-utils';
import { v4 as uuid } from 'uuid';

export abstract class ConstraintFunction {
  constructor(
    protected readonly students: Student[],
    protected readonly skills: Skill[],
    protected operators: Operator[] = Object.values(Operator),
    readonly id: string = uuid()
  ) {}

  abstract filterStudentsByConstraintFunction(property: string, operator: Operator, value: string): Student[];

  abstract getProperties(): PropertySelectGroup;

  abstract getValues(): SelectData[];

  getOperators(): SelectData[] {
    return this.operators.map(operator => ({
      id: operator,
      name: OperatorMapping[operator],
    }));
  }

  protected combineStudentAndProjects(projectId: string, students: Student[]): string {
    return students.map(student => mapTwoValues(student.id, projectId)).join(' + ');
  }
}

export interface ConstraintFunctionValues {
  property: string;
  operator: Operator;
  value: string;
}

export interface SelectData {
  name: string; //shown in the dropdown
  id: string; //value to be used in constraint
}

export interface PropertySelectGroup {
  name: string; //shown in the dropdown
  values: SelectData[];
  constraintFunction: ConstraintFunction;
}
