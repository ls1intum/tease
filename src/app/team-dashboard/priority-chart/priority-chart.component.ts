import {Component, Input, OnInit} from "@angular/core";
import 'chart.js'
import {PersonStatisticsService} from "../../shared/layers/business-logic-layer/person-statistics.service";
import {ArrayHelper} from "../../shared/helpers/array.helper";
import {Team} from "../../shared/models/team";
import {Observable} from "rxjs";

/**
 * Created by Malte Bucksch on 16/01/2017.
 */


@Component({
  templateUrl: './priority-chart.component.html',
  selector: 'priority-chart',
  styleUrls: ['./priority-chart.component.scss'],
})
export class PriorityChartComponent implements OnInit {
  @Input()
  private team: Team;

  private dataSet: {label: string; data: number[]}[] = [];
  private labels: string[] = [];

  constructor(private personStatisticsService: PersonStatisticsService) {

  }

  ngOnInit(): void {
    this.updateDataset()
    this.updateLabels();

    Observable.of(this.team.persons).subscribe(event => {
      this.updateDataset();
      this.updateLabels();
    });
  }

  private updateDataset() {
    let priorities = ArrayHelper.createNumberRange(this.personStatisticsService.getPriorityCountMax(this.team));
    let priorityCount = priorities.map(prio =>
      this.personStatisticsService.getNumberOfPersonsForPriority(prio, this.team));

    this.dataSet = [{label: "# of persons", data: priorityCount}];
  }

  private updateLabels() {
    let priorities = ArrayHelper.createNumberRange(this.personStatisticsService.getPriorityCountMax(this.team));

    this.labels = priorities.map(prio => String(prio + 1));
  }
}
