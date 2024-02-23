import { Student } from 'src/app/api/models';
import { ConstraintFunction } from './constraint-function';
import { Operator, mapStudentAndProject } from '../constraint-utils';

export abstract class StudentConstraintFunction implements ConstraintFunction {
  constructor(
    protected readonly key: keyof Student,
    protected readonly operator: Operator,
    protected readonly value: string
  ) {}

  getConstraintFunction(students: Student[], projectId: string): string {
    return students
      .filter(student => this.fulfillsConstraint(student[this.key] as string))
      .map(student => mapStudentAndProject(student.id, projectId))
      .join(' + ');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract fulfillsConstraint(value: any): boolean;
}
