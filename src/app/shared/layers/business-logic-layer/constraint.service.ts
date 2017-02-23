import {Injectable} from "@angular/core";
import {ConstraintAccessService} from "../data-access-layer/constraint.access.service";
import {Constraint} from "../../models/constraints/constraint";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

@Injectable()
export class ConstraintService {
  constructor(private constraintAccessService: ConstraintAccessService){

  }

  saveConstraint(constraint: Constraint) {
    this.constraintAccessService.saveConstraint(constraint);
  }
  fetchConstraints(): Constraint[]{
    return this.constraintAccessService.fetchConstraints();
  }
}
