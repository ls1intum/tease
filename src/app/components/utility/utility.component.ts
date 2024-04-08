import { Component, Input } from '@angular/core';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { facCloseIcon } from 'src/assets/icons/icons';

enum ViewMode {
  Students,
  Statistics,
}

export enum StatisticsViewMode {
  PriorityDistribution = 'Priority Distribution',
  Proficiency = 'Intro Course Proficiency',
}

@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrl: './utility.component.scss',
})
export class UtilityComponent {
  facCloseIcon = facCloseIcon;

  viewMode = ViewMode.Statistics;
  ViewMode = ViewMode;

  statisticsSelectData: SelectData[] = [];
  selectedStatistics: string = 'statistics-priority-distribution';

  utilityContainerVisible = true;

  @Input({ required: true }) allocationData: AllocationData;

  selectViewMode(viewMode: ViewMode): void {
    this.viewMode = viewMode;
  }

  toggleUtilityContainer(): void {
    this.utilityContainerVisible = !this.utilityContainerVisible;
  }

  statisticsSelectDataChange(selectData: SelectData[]): void {
    this.statisticsSelectData = selectData;
    if (!!selectData && selectData.length > 0 && !this.selectedStatistics) {
      this.selectedStatistics = selectData[0].name;
    }
  }
}
