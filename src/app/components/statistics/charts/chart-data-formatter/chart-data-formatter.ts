import { ChartConfiguration } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { PeopleChartProjectData } from './people-chart-data';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';

export interface ChartDataFormatter {
  getDoughnutData(allocationData: AllocationData, id: string): ChartConfiguration<'doughnut'>['data'];
  getPeopleData(allocationData: AllocationData, id: string): PeopleChartProjectData[];
  getSelectData(): SelectData[];
}
