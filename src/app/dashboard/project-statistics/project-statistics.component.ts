import { Component, Input, OnInit } from '@angular/core';
import { Team } from '../../shared/models/team';
import { Constraint, ConstraintType } from '../../shared/models/constraints/constraint';
import { ConstraintService } from '../../shared/layers/business-logic-layer/constraint.service';

@Component({
  selector: 'app-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrls: ['./project-statistics.component.scss'],
})
export class ProjectStatisticsComponent implements OnInit {
  @Input()
  team: Team;

  constraints: Constraint[] = [];

  ConstraintType = ConstraintType;

  constructor(private constraintService: ConstraintService) {}

  ngOnInit(): void {
    this.constraintService.getApplicableConstraints(this.team).then(constraints => {
      this.constraints = constraints;
    });
  }
}
