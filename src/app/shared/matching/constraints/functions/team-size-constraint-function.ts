import { Student } from 'src/app/api/models';
import { ConstraintFunction } from './constraint-function';
import { mapStudentAndProject } from '../constraint-utils';

export class TeamSizeConstraintFunction implements ConstraintFunction {
  getConstraintFunction(students: Student[], projectId: string): string {
    return students.map(student => mapStudentAndProject(student.id, projectId)).join(' + ');
  }
}
