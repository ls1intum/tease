import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Constraint, ConstraintType} from '../../shared/models/constraints/constraint';
import {ConstraintService} from '../../shared/layers/business-logic-layer/constraint.service';
import {PersonStatisticsService} from '../../shared/layers/business-logic-layer/person-statistics.service';

@Component({
  selector: 'app-team-statistics',
  templateUrl: './team-statistics.component.html',
  styleUrls: ['./team-statistics.component.scss']
})
export class TeamStatisticsComponent implements OnInit {
  @Input()
  team: Team;

  constraints: Constraint[] = [];

  ConstraintType = ConstraintType;

  constructor(private constraintService: ConstraintService,
              private statisticsService: PersonStatisticsService) {
  }

  ngOnInit(): void {
    this.constraintService.getApplicableConstraints(this.team).then(constraints => {
      this.constraints = constraints;
    });
  }
}
