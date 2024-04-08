import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { IntroCourseProficiencyChartDataService } from './charts/chart-data-formatter/formatters/intro-course-proficiency-chart-data.service';
import { PriorityChartDataService } from './charts/chart-data-formatter/formatters/priority-chart-data.service';
import { StatisticsViewMode } from '../utility/utility.component';
import { PeopleChartProjectData } from './charts/chart-data-formatter/people-chart-data';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { ChartDataFormatter } from './charts/chart-data-formatter/chart-data-formatter';
import { SkillsProficiencyChartDataService } from './charts/chart-data-formatter/formatters/skills-proficiency-chart-data.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent implements OnInit, OnChanges {
  @Input({ required: true }) allocationData: AllocationData;
  @Input({ required: true }) selectedDataId: string;

  @Output() selectDataChange = new EventEmitter<SelectData[]>();
  private selectData: SelectData[];

  doughnutChartData: ChartConfiguration<'doughnut'>['data'];
  peopleChartData: PeopleChartProjectData[];
  private formatters: ChartDataFormatter[] = [];

  constructor(
    private introCourseProficencyChartData: IntroCourseProficiencyChartDataService,
    private priorityChartDataService: PriorityChartDataService,
    private skillsProficiencyChartData: SkillsProficiencyChartDataService
  ) {}

  ngOnInit() {
    this.updateSelectData();
    this.updateChartData();
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges['selectedDataId']) {
      this.updateChartData();
    } else {
      this.updateSelectData();
    }
  }

  updateChartData(): void {
    const formatter = this.selectData.find(data => data.id === this.selectedDataId).reference as ChartDataFormatter;
    this.peopleChartData = formatter.getPeopleData(this.allocationData, this.selectedDataId);
    this.doughnutChartData = formatter.getDoughnutData(this.allocationData, this.selectedDataId);
  }

  updateSelectData(): void {
    const formatters = [
      this.priorityChartDataService,
      this.introCourseProficencyChartData,
      this.skillsProficiencyChartData,
    ];
    this.selectData = formatters.flatMap(formatter => formatter.getSelectData());
    this.selectDataChange.emit(this.selectData);
  }
}
