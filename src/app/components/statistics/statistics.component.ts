import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { ProficiencyChartDataService } from './charts/chart-data-formatter/formatters/proficiency-chart-data.service';
import { PriorityChartDataService } from './charts/chart-data-formatter/formatters/priority-chart-data.service';
import { StatisticsViewMode } from '../utility/utility.component';
import { PeopleChartProjectData } from './charts/chart-data-formatter/people-chart-data';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, OnChanges {
  @Input({ required: true }) allocationData: AllocationData;
  @Input({ required: true }) statisticsViewMode: StatisticsViewMode;

  doughnutChartData: ChartConfiguration<'doughnut'>['data'];
  peopleChartData: PeopleChartProjectData[];

  constructor(
    private proficencyChartData: ProficiencyChartDataService,
    private priorityChartDataService: PriorityChartDataService
  ) {}

  ngOnInit() {
    this.updateDougnutChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDougnutChartData();
    this.updatePeopleChartData();
  }

  updatePeopleChartData(): void {
    if (this.statisticsViewMode === StatisticsViewMode.PriorityDistribution) {
      this.peopleChartData = this.priorityChartDataService.getPeopleData(this.allocationData);
    }
    if (this.statisticsViewMode === StatisticsViewMode.Proficiency) {
      this.peopleChartData = this.proficencyChartData.getPeopleData(this.allocationData);
    }
  }

  updateDougnutChartData(): void {
    if (this.statisticsViewMode === StatisticsViewMode.PriorityDistribution) {
      this.doughnutChartData = this.priorityChartDataService.getDoughnutData(this.allocationData);
    }
    if (this.statisticsViewMode === StatisticsViewMode.Proficiency) {
      this.doughnutChartData = this.proficencyChartData.getDoughnutData(this.allocationData);
    }
  }
}
