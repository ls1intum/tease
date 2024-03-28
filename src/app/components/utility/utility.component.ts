import { Component, Input } from '@angular/core';
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

  StatisticsViewMode = StatisticsViewMode;
  statisticsViewMode = StatisticsViewMode.PriorityDistribution;

  utilityContainerVisible = true;

  @Input({ required: true }) allocationData: AllocationData;

  selectViewMode(viewMode: ViewMode): void {
    this.viewMode = viewMode;
  }

  selectStatisticsViewMode(statisticsViewMode: StatisticsViewMode): void {
    this.statisticsViewMode = statisticsViewMode;
  }

  toggleUtilityContainer(): void {
    this.utilityContainerVisible = !this.utilityContainerVisible;
  }
}
