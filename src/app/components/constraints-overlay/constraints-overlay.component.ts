import { Component, OnInit } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { ConstraintsService } from '../../shared/data/constraints.service';
import { ConstraintWrapper } from '../../shared/matching/constraints/constraint';
import { MatchingService } from 'src/app/shared/matching/matching.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { MandatoryConstraintsService } from 'src/app/shared/matching/constraints/mandatory-contraints';
import { CostFunctionsService } from 'src/app/shared/matching/constraints/cost-functions';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrl: './constraints-overlay.component.scss',
})
export class ConstraintsOverlayComponent implements OverlayComponent, OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  constraints: ConstraintWrapper[];

  constructor(
    private constraintsService: ConstraintsService,
    private mandatoryConstraintsService: MandatoryConstraintsService,
    private costFunctionsService: CostFunctionsService,
    private matchingService: MatchingService,
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private allocationsService: AllocationsService
  ) {}

  ngOnInit() {
    this.constraints = this.constraintsService.getConstraints();
  }

  async distributeTeams() {
    const students = this.studentsService.getStudents();
    const projects = this.projectsService.getProjects();
    const constraints = this.constraints.flatMap(constraint => constraint.constraint);

    constraints.push(
      ...this.mandatoryConstraintsService.createMandatoryConstraints(students, projects),
      this.costFunctionsService.createCostFunction(students)
    );
    const allocations = await this.matchingService.getAllocations(constraints);
    if (allocations) {
      this.allocationsService.setAllocations(allocations);
    }
  }

  deleteConstraint(constraint: ConstraintWrapper) {
    this.constraintsService.deleteConstraint(constraint);
  }
}
