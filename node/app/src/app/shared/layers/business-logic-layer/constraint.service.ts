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

  saveConstraints(constraints: Constraint[]) {
    this.constraintAccessService.saveConstraints(constraints);
  }

  fetchConstraints(): Promise<Constraint[]> {
    return this.constraintAccessService.fetchConstraints();
  }

  // Returns an array of constraints applicable to the current team only
  // Note: these constraints differ from those stored in memory, and hence should not be saved!
  getApplicableConstraints(team?: Team): Promise<Constraint[]> {
    return new Promise((resolve, reject) => {
      this.fetchConstraints().then(constraints => {

        console.log('Choosing applicable constraints from:', constraints);

        let applicableConstraints = [];

        constraints.forEach(constraint => {

          if (!constraint.isEnabled) {
            return;
          }

          if (!team && !constraint.getTeamName() // global constraint
            || team && constraint.getTeamName() === team.name) { // team-based constraint
            applicableConstraints.push(constraint);
          }
        });

        resolve(applicableConstraints);
      });
    });
  }
}
