export interface PeopleChartProjectData {
  name: string;
  tag: string;
  studentData: PeopleChartStudentData[];
}

export interface PeopleChartStudentData {
  color: string;
  tooltip: string;
}
