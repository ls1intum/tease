import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Constraint} from '../../shared/models/constraints/constraint';
import {ConstraintService} from '../../shared/layers/business-logic-layer/constraint.service';
import {PersonStatisticsService} from '../../shared/layers/business-logic-layer/person-statistics.service';

@Component({
  selector: 'app-team-score',
  templateUrl: './team-score.component.html',
  styleUrls: ['./team-score.component.scss']
})
export class TeamScoreComponent implements OnInit {
  @Input()
  private team: Team;

  private constraints: Constraint[] = [];

  constructor(private constraintService: ConstraintService,
              private statisticsService: PersonStatisticsService) {
  }

  ngOnInit(): void {
    this.constraintService.getApplicableConstraints(this.team).then(constraints => {
      this.constraints = constraints;
    });
  }

  calculateOverallScore(): string {
    const score = this.statisticsService.calcTeamQualityScore(this.team, this.constraints);
    if (isNaN(score))return 'None';
    return score.toFixed(1);
  }

  isSatisfied(constraint: Constraint): boolean {
    return constraint.isSatisfied(this.team);
  }
}
