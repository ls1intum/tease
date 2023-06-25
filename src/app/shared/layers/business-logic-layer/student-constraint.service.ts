import { StudentConstraint } from '../../models/student-constraints/student-constraint';
import { Student } from '../../models/student';

export class StudentConstraintService {
  static personConstraints: StudentConstraint[] = [];

  static matchesConstraints(person: Student) {
    return this.personConstraints.reduce((acc, constraint) => acc && constraint.isFullfilledFor(person), true);
  }
}
