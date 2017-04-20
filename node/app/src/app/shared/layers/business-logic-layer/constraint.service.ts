import {Injectable} from "@angular/core";
import {ConstraintAccessService} from "../data-access-layer/constraint.access.service";
import {Constraint} from "../../models/constraints/constraint";
import {Team} from "../../models/team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

@Injectable()
export class ConstraintService {
  constructor(private constraintAccessService: ConstraintAccessService) {
  }

  private sortConstraintsByPriority(constraint1, constraint2): number {
    // team-based constraints should come first
    // then global ones
    let isTeamBased1 = constraint1.getTeamName() !== Team.SpecialTeamNameForGlobalConstraints;
    let isTeamBased2 = constraint2.getTeamName() !== Team.SpecialTeamNameForGlobalConstraints;
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

    let mergedConstraints = [];

    let constraintsGroupedByClass = {};

    for (let i = 0; i < constraints.length; i++) {

      let className = constraints[i].constructor.name;
      if (!(className in constraintsGroupedByClass)) {
        constraintsGroupedByClass[className] = [];
      }
      constraintsGroupedByClass[className].push(constraints[i]);

    }

    for (let className in constraintsGroupedByClass) {

      let constraintsOfTheSameType = constraintsGroupedByClass[className];

      constraintsOfTheSameType.sort(this.sortConstraintsByPriority);

      // clone the original object
      let templateObject = constraintsOfTheSameType[0];
      let mergedConstraint = Object.assign(Object.create(templateObject), templateObject);

      // merge constraints into the new object
      for (let constraint of constraintsOfTheSameType) {

        if (typeof mergedConstraint.getMinValue() !== 'number' && typeof constraint.getMinValue() === 'number') {
          mergedConstraint.setMinValue(constraint.getMinValue());
        }

        if (typeof mergedConstraint.getMaxValue() !== 'number' && typeof constraint.getMaxValue() === 'number') {
          mergedConstraint.setMaxValue(constraint.getMaxValue());
        }

      }

      mergedConstraints.push(mergedConstraint);

    }

    return mergedConstraints;
  }

  // Returns an array of constraints applicable to the current team only
  // Note: these constraints differ from those stored in memory, and hence should not be saved!
  getApplicableConstraints(team?: Team): Promise<Constraint[]> {
    return new Promise((resolve, reject) => {
      this.fetchConstraints().then(constraints => {

        let applicableConstraints = [];

        constraints.forEach(constraint => {

          if (!constraint.isEnabled) {
            return;
          }

          if (constraint.getTeamName() === Team.SpecialTeamNameForGlobalConstraints // global constraint
            || team && constraint.getTeamName() === team.name) { // team-based constraint
            applicableConstraints.push(constraint);
          }
        });

        let mergedConstraints = this.mergeConstraintsOfTheSameType(applicableConstraints);

        resolve(mergedConstraints);
      });
    });
  }
}
