import { StudentConstraint } from '../../models/student-constraints/student-constraint';
import { Student } from '../../models/student';

export class StudentConstraintService {
  static studentConstraints: StudentConstraint[] = [];

  static matchesConstraints(student: Student) {
    return this.studentConstraints.reduce((acc, constraint) => acc && constraint.isFullfilledFor(student), true);
  }
}
