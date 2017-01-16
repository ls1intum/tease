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
  templateUrl: './priority-chart.component.html',
  selector: 'priority-chart',
  styleUrls: ['./priority-chart.component.scss'],
})
export class PriorityChartComponent implements OnInit,DoCheck {
  @Input()
  private team: Team;

  private dataSet: {label: string; data: number[]}[] = [];
  private labels: string[] = [];

  private lastPersonLength = 0;

  constructor(private personStatisticsService: PersonStatisticsService) {

  }

  ngOnInit(): void {
    this.updateDataset()
    this.updateLabels();
  }

  ngDoCheck(): void {
    if (this.lastPersonLength != this.team.persons.length) {
      this.onChangeDetected();
      this.lastPersonLength = this.team.persons.length;
    }
  }

  onChangeDetected() {
    this.updateDataset();
    this.updateLabels();
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
