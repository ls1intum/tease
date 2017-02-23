import {Component, Input, OnInit, OnChanges, SimpleChanges, DoCheck} from "@angular/core";
import 'chart.js'
import {PersonStatisticsService} from "../../shared/layers/business-logic-layer/person-statistics.service";
import {ArrayHelper} from "../../shared/helpers/array.helper";
import {Team} from "../../shared/models/team";
import {Observable} from "rxjs";
import {Person} from "../../shared/models/person";

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

  constructor(private personStatisticsService: PersonStatisticsService) {

  }

  ngOnInit(): void {

  }


}
