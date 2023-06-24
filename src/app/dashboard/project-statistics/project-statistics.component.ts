import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project';
import { Constraint, ConstraintType } from '../../shared/models/constraints/constraint';
import { ConstraintService } from '../../shared/layers/business-logic-layer/constraint.service';

@Component({
  selector: 'app-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrls: ['./project-statistics.component.scss'],
})
export class ProjectStatisticsComponent implements OnInit {
  @Input()
  team: Project;

  constraints: Constraint[] = [];

  ConstraintType = ConstraintType;

  constructor(private constraintService: ConstraintService) {}

  ngOnInit(): void {
    this.constraintService.getApplicableConstraints(this.team).then(constraints => {
      this.constraints = constraints;
    });
  }
}
