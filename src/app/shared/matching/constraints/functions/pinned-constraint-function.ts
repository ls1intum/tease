import { Student } from 'src/app/api/models';
import { ConstraintFunction } from './constraint-function';
import { mapStudentAndProject } from '../../constraints-2/constraint-utils';

export class PinnedConstraintFunction implements ConstraintFunction {
  private studentId: string;

  constructor(studentId: string) {
    this.studentId = studentId;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getConstraintFunction(students: Student[], projectId: string): string {
    return mapStudentAndProject(this.studentId, projectId);
  }
}
