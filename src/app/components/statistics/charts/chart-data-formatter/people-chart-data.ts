import { ChartConfiguration } from 'chart.js';
export interface ChartProjectData {
  name: string;
  tag: string;
  peopleStudentData?: PeopleChartStudentData[];
  barStudentData?: ChartConfiguration<'bar'>;
}

export interface PeopleChartStudentData {
  color: string;
  tooltip: string;
}
