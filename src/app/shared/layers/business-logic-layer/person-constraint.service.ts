import { PersonConstraint } from '../../models/person-constraints/person-constraint';
import { Student } from '../../models/student';

export class PersonConstraintService {
  static personConstraints: PersonConstraint[] = [];

  static matchesConstraints(person: Student) {
    return this.personConstraints.reduce((acc, constraint) => acc && constraint.isFullfilledFor(person), true);
  }
}
