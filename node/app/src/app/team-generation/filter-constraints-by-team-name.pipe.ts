import {Pipe, PipeTransform} from "@angular/core";
import {Constraint} from "../shared/models/constraints/constraint";
import {Team} from "../shared/models/team";

@Pipe({name: 'filterConstraintsByTeamName'})
export class FilterConstraintsByTeamNamePipe implements PipeTransform {
  transform(constraints: Constraint[], teamName: string) {

    if (constraints && constraints.filter) {
      return constraints.filter(constraint => {

        // Case 1: global constraint
        if (!constraint.getTeamName() || constraint.getTeamName() === Team.SpecialTeamNameForGlobalConstraints) {
          return !teamName || teamName === Team.SpecialTeamNameForGlobalConstraints; // Return these constraints only when the team is not specified
        }

        // Case 2: return only the corresponding constraints for the given team
        return constraint.getTeamName() === teamName;
      });
    }
  }
}
