import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { IntroCourseProficiencyChartDataService } from './charts/chart-data-formatter/formatters/intro-course-proficiency-chart-data.service';
import { PriorityChartDataService } from './charts/chart-data-formatter/formatters/priority-chart-data.service';
import { ChartProjectData } from './charts/chart-data-formatter/people-chart-data';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { ChartDataFormatter } from './charts/chart-data-formatter/chart-data-formatter';
import { SkillsProficiencyChartDataService } from './charts/chart-data-formatter/formatters/skills-proficiency-chart-data.service';

@Component({
  standalone: false,
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, OnChanges {
  @Input({ required: true }) allocationData: AllocationData;
  @Input({ required: true }) selectedDataId: string;
  @Input({ required: true }) formatter: ChartDataFormatter;

  doughnutChartData: ChartConfiguration<'doughnut'>['data'];
  peopleChartData: ChartProjectData[];

  constructor() {}

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges(): void {
    this.updateChartData();
  }

  updateChartData(): void {
    if (!this.allocationData || !this.selectedDataId || !this.formatter) {
      return;
    }
    this.peopleChartData = this.formatter.getProjectData(this.allocationData, this.selectedDataId);
    this.doughnutChartData = this.formatter.getDoughnutData(this.allocationData, this.selectedDataId);
  }
}
