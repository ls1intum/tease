import { Student } from 'src/app/api/models';
import { ConstraintFunction } from './functions/constraint-function';
import { Operator } from '../constraints-2/constraint-utils';

export class Constraint {
  constructor(
    private constraintFunction: ConstraintFunction,
    private operator: Operator,
    private bound: number
  ) {}

  getConstraint(students: Student[], projectId: string): string {
    return this.constraintFunction.getConstraintFunction(students, projectId).concat(` ${this.operator} ${this.bound}`);
  }

  getConstraints(): ConstraintGroup[] {
    return this.constraints;
  }

  constraints = [
    {
      title: 'Language',
      keys: [
        { title: 'German', key: 'de' },
        { title: 'English', key: 'en' },
      ],
    },
    {
      title: 'Skills',
      keys: [
        { title: 'Machine Learning', key: 'Machine Learning' },
        { title: 'Server-side development', key: 'Server-side development' },
        { title: 'Flutter', key: 'Flutter' },
        { title: 'Docker, Kubernetes', key: 'Docker, Kubernetes' },
      ],
    },
    {
      title: 'Gender',
      keys: [{ title: 'Gender', key: 'Gender' }],
    },
  ];
}

export interface ConstraintGroup {
  title: string;
  keys: ConstraintKey[];
}

export interface ConstraintKey {
  title: string;
  key: string;
}
