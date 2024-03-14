import { Component, OnInit } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { ConstraintsService } from '../../shared/data/constraints.service';
import { ConstraintWrapper } from '../../shared/matching/constraints/constraint';
import { MatchingService } from 'src/app/shared/matching/matching.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { MandatoryConstraintsService } from 'src/app/shared/matching/constraints/mandatory-contraints';
import { CostFunctionsService } from 'src/app/shared/matching/constraints/cost-functions';
import { AllocationsService } from 'src/app/shared/data/allocations.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrl: './constraints-overlay.component.css',
})
export class ConstraintsOverlayComponent implements OverlayComponent, OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  constructor(
    private constraintsService: ConstraintsService,
    private mandatoryConstraintsService: MandatoryConstraintsService,
    private costFunctionsService: CostFunctionsService,
    private matchingService: MatchingService,
    private studentsService: StudentsService,
    private allocationsService: AllocationsService
  ) {}

  constraints: ConstraintWrapper[];

  ngOnInit() {
    this.constraints = this.constraintsService.getConstraints();
  }

  async distributeTeams() {
    const constraints = this.constraints.flatMap(constraint => constraint.constraint);
    constraints.push(...this.mandatoryConstraintsService.constraints);
    constraints.push(...this.costFunctionsService.constraints);
    const allocations = await this.matchingService.getAllocations(constraints);
    this.allocationsService.setAllocations(allocations);
  }

  deleteConstraint(constraint: ConstraintWrapper) {
    this.constraintsService.deleteConstraint(constraint);
  }
}
