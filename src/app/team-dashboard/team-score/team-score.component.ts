import {Component, Input, OnInit, OnChanges, SimpleChanges, DoCheck} from "@angular/core";
import 'chart.js'
import {PersonStatisticsService} from "../../shared/layers/business-logic-layer/person-statistics.service";
import {ArrayHelper} from "../../shared/helpers/array.helper";
import {Team} from "../../shared/models/team";
import {Observable} from "rxjs";
import {Person} from "../../shared/models/person";
import {ConstraintService} from "../../shared/layers/business-logic-layer/constraint.service";
import {Constraint} from "../../shared/models/constraints/constraint";

/**
 * Created by Malte Bucksch on 16/01/2017.
 */


@Component({
  templateUrl: 'team-score.component.html',
  selector: 'team-score',
  styleUrls: ['team-score.component.scss'],
})
export class TeamScoreComponent implements OnInit {
  @Input()
  private team: Team;

  private constraints: Constraint[] = [];

  constructor(private constraintService: ConstraintService) {
  }

  ngOnInit(): void {
    this.constraints = this.constraintService.fetchConstraints();
  }

  calculateOverallScore(): number {
    let scoreSum = this.constraints.reduce((sum, current) => {
      return sum + current.calculateSatisfactionScore(this.team);
    }, 0);
    return scoreSum / this.constraints.length;
  }

  isSatisfied(constraint: Constraint): boolean {
    return constraint.isSatisfied(this.team);
  }
}
