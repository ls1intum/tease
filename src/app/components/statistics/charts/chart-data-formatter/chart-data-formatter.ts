import { ChartConfiguration } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { PeopleChartProjectData } from './people-chart-data';

export interface ChartDataFormatter {
  getDoughnutData(allocationData: AllocationData): ChartConfiguration<'doughnut'>['data'];
  getPeopleData(allocationData: AllocationData): PeopleChartProjectData[];
}
