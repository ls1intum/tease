import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {ArrayHelper} from '../../shared/helpers/array.helper';
import {Team} from '../../shared/models/team';
import {PersonStatisticsService} from '../../shared/layers/business-logic-layer/person-statistics.service';

@Component({
  selector: 'app-team-priorities-chart',
  templateUrl: './team-priorities-chart.component.html',
  styleUrls: ['./team-priorities-chart.component.scss']
})
export class TeamPrioritiesChartComponent implements OnInit, DoCheck {
  @Input()
  private team: Team;

  private dataSet: {label: string; data: number[]}[] = [];
  private labels: string[] = [];
  private averagePriority = 0;

  private lastPersonLength = 0;

  constructor(private personStatisticsService: PersonStatisticsService) {}

  ngOnInit(): void {
    this.updateDataset();
    this.updateLabels();
  }

  ngDoCheck(): void {
    if (this.lastPersonLength !== this.team.persons.length) {
      this.onChangeDetected();
      this.lastPersonLength = this.team.persons.length;
    }
  }

  onChangeDetected() {
    this.updateDataset();
    this.updateLabels();
  }

  private updateDataset() {
    const priorities = ArrayHelper.createNumberRange(this.personStatisticsService.getPriorityCountMax(this.team));
    const priorityCountMap = priorities.map(prio =>
      this.personStatisticsService.getNumberOfPersonsForPriority(prio, this.team));
    this.dataSet = [{label: 'Number of Persons With Project Priority', data: priorityCountMap}];
    this.averagePriority = this.personStatisticsService.getAverageTeamPriorityOfPersons(this.team);
  }

  isAnyPriorityGiven(): boolean {
    return !isNaN(this.averagePriority);
  }

  private updateLabels() {
    const priorities = ArrayHelper.createNumberRange(this.personStatisticsService.getPriorityCountMax(this.team));

    this.labels = priorities.map(prio => String(prio + 1));
  }

  private getAverageTeamPriority(): string {
    return this.averagePriority.toFixed(1);
  }
}
