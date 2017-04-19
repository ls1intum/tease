import {Pipe, PipeTransform} from "@angular/core";
import {Constraint} from "../shared/models/constraints/constraint";

@Pipe({name: 'filterConstraintsByTeamName'})
export class FilterConstraintsByTeamNamePipe implements PipeTransform {
  transform(constraints: Constraint[], teamName: string) {
    if (constraints && constraints.filter) {
      return constraints.filter(constraint => {
        if (!constraint.getTeamName()) {
          // Not a team-based constraint
          return !teamName; // Return these constraints only when the team is not specified
        }
        // Else return the corresponding constraints for the given team
        return constraint.getTeamName() === teamName;
      });
    }
  }
}
