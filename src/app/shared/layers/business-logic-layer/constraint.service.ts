import { Injectable } from '@angular/core';
import { ConstraintAccessService } from '../data-access-layer/constraint.access.service';
import { Constraint } from '../../models/constraints/constraint';
import { Team } from '../../models/team';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

@Injectable()
export class ConstraintService {
  constructor(private constraintAccessService: ConstraintAccessService) {}

  private sortConstraintsByPriority(constraint1, constraint2): number {
    // team-based constraints should come first
    // then global ones
    const isTeamBased1 = constraint1.getTeamName() !== null;
    const isTeamBased2 = constraint2.getTeamName() !== null;
    if (isTeamBased1 || isTeamBased2) {
      if (isTeamBased1 && isTeamBased2) {
        return 0; // both team-based - no preference
      }
      return isTeamBased1 ? -1 : +1; // prefer the team-based over global
    }
    return 0; // both global - no preference
  }

  saveConstraints(constraints: Constraint[]) {
    this.constraintAccessService.saveConstraints(constraints);
  }

  fetchConstraints(): Promise<Constraint[]> {
    return this.constraintAccessService.fetchConstraints();
  }

  // merges all constraints of the same type into just one 'representative' constraint
  // e.g. global '8 <= team size <= 9' and team-based 'team size >= 5' will be merged into '5 <= team size <= 9'
  // note: this also allows constraints to be enabled and not fully specified (e.g. empty, or partial)
  mergeConstraintsOfTheSameType(constraints: Constraint[]): Constraint[] {
    const mergedConstraints = [];

    const constraintsGroupedByClass = {};

    for (let i = 0; i < constraints.length; i++) {
      const className = constraints[i].constructor.name;
      if (!(className in constraintsGroupedByClass)) {
        constraintsGroupedByClass[className] = [];
      }
      constraintsGroupedByClass[className].push(constraints[i]);
    }

    for (const className in constraintsGroupedByClass) {
      const constraintsOfTheSameType = constraintsGroupedByClass[className];

      constraintsOfTheSameType.sort(this.sortConstraintsByPriority);

      // using only the constraint with the highest priority
      mergedConstraints.push(constraintsOfTheSameType[0]);
    }

    return mergedConstraints;
  }

  // Returns an array of constraints applicable to the current team only
  // Note: these constraints differ from those stored in memory, and hence should not be saved!
  getApplicableConstraints(team?: Team): Promise<Constraint[]> {
    return new Promise((resolve, reject) => {
      this.fetchConstraints().then(constraints => {
        const applicableConstraints = [];

        constraints.forEach(constraint => {
          if (!constraint.isEnabled) {
            return;
          }

          if (
            constraint.getTeamName() === null || // global constraint
            (team && constraint.getTeamName() === team.name)
          ) {
            // team-based constraint
            applicableConstraints.push(constraint);
          }
        });

        const mergedConstraints = this.mergeConstraintsOfTheSameType(applicableConstraints);

        resolve(mergedConstraints);
      });
    });
  }
}
