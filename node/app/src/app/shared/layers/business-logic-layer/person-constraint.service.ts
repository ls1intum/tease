import {PersonConstraint} from '../../models/person-constraints/person-constraint';
import {Person} from '../../models/person';

export class PersonConstraintService {
  static personConstraints: PersonConstraint[] = [];

  static matchesConstraints(person: Person) {
    return this.personConstraints.reduce((acc, constraint) => acc && constraint.isFullfilledFor(person), true);
  }
}
