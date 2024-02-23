import { Student } from 'src/app/api/models';

export interface ConstraintFunction {
  getConstraintFunction(students: Student[], projectId: string): string;
}
