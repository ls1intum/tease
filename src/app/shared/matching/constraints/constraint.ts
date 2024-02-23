import { Student } from 'src/app/api/models';
import { ConstraintFunction } from './functions/constraint-function';
import { Operator } from './constraint-utils';

export class Constraint {
  constructor(
    private constraintFunction: ConstraintFunction,
    private operator: Operator,
    private bound: number
  ) {}

  getConstraint(students: Student[], projectId: string): string {
    return this.constraintFunction.getConstraintFunction(students, projectId).concat(` ${this.operator} ${this.bound}`);
  }
}
