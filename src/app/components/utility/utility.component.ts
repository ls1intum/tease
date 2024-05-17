import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { facCloseIcon, facWarnIcon } from 'src/assets/icons/icons';
import { IntroCourseProficiencyChartDataService } from '../statistics/charts/chart-data-formatter/formatters/intro-course-proficiency-chart-data.service';
import { PriorityChartDataService } from '../statistics/charts/chart-data-formatter/formatters/priority-chart-data.service';
import { SkillsProficiencyChartDataService } from '../statistics/charts/chart-data-formatter/formatters/skills-proficiency-chart-data.service';
import { ChartDataFormatter } from '../statistics/charts/chart-data-formatter/chart-data-formatter';

enum ViewMode {
  Students,
  Statistics,
}
@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrl: './utility.component.scss',
})
export class UtilityComponent implements OnInit, OnChanges {
  facCloseIcon = facCloseIcon;
  facWarnIcon = facWarnIcon;

  viewMode = ViewMode.Students;
  ViewMode = ViewMode;

  statisticsSelectData: SelectData[] = [];
  selectedStatisticsId: string;
  selectedStatisticsFormatter: ChartDataFormatter;

  utilityContainerVisible = true;

  @Input({ required: true }) allocationData: AllocationData;

  constructor(
    private introCourseProficencyChartData: IntroCourseProficiencyChartDataService,
    private priorityChartDataService: PriorityChartDataService,
    private skillsProficiencyChartData: SkillsProficiencyChartDataService
  ) {}

  ngOnInit(): void {
    this.updateSelectData();
    this.changeSelectedStatisticsId();
  }

  ngOnChanges(): void {
    this.updateSelectData();
    this.changeSelectedStatisticsId();
  }

  selectViewMode(viewMode: ViewMode): void {
    this.viewMode = viewMode;
  }

  toggleUtilityContainer(): void {
    this.utilityContainerVisible = !this.utilityContainerVisible;
  }
  changeSelectedStatisticsId() {
    if (!this.selectedStatisticsId) {
      this.selectedStatisticsId = this.statisticsSelectData[0]?.id;
    }

    this.selectedStatisticsFormatter = this.statisticsSelectData.find(
      selectData => selectData.id === this.selectedStatisticsId
    )?.reference;
  }

  updateSelectData(): void {
    const formatters = [
      this.priorityChartDataService,
      this.introCourseProficencyChartData,
      this.skillsProficiencyChartData,
    ];
    this.statisticsSelectData = formatters.flatMap(formatter => formatter.getSelectData());
  }
}
