import { Skill, Student } from 'src/app/api/models';
import { Operator, OperatorMapping } from '../constraint-utils';

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

export abstract class ConstraintFunction {
  constructor(
    protected readonly students: Student[],
    protected readonly skills: Skill[],
    protected operators: Operator[] = Object.values(Operator),
    readonly id: string = 'cf-abstract'
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
}
