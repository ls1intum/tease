import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { ChartDataFormatter } from '../chart-data-formatter';
import { ColorService } from 'src/app/shared/constants/color.service';
import { Device, SkillProficiency, Student } from 'src/app/api/models';
import { Comparator, Operator, SkillLevels } from 'src/app/shared/matching/constraints/constraint-utils';
import { PeopleChartProjectData, PeopleChartStudentData } from '../people-chart-data';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';

@Injectable({
  providedIn: 'root',
})
export class DevicesChartDataService implements ChartDataFormatter {
  getDoughnutData(allocationData: AllocationData, id: string): ChartData<'doughnut', number[], unknown> {
    const device = id as Device;
    const deviceCount = this.getDeviceCount(allocationData, device);
    const studentCount = this.getStudentCount(allocationData);

    return {
      labels: [`${device}`, `None`],
      datasets: [
        {
          data: [deviceCount, studentCount - deviceCount],
          backgroundColor: [
            ColorService.getSkillProficiencyColor(SkillProficiency.Advanced),
            ColorService.getSkillProficiencyColor(),
          ],
        },
      ],
    };
  }

  getPeopleData(allocationData: AllocationData, id: string): PeopleChartProjectData[] {
    const device = id as Device;
    const data: PeopleChartProjectData[] = [];

    allocationData.projectsData.forEach(projectData => {
      const studentData: PeopleChartStudentData[] = [];

      const students = [...projectData.students].sort((a, b) =>
        a.devices.includes(device) && !b.devices.includes(device) ? -1 : 1
      );

      students.forEach(student => {
        studentData.push({
          color: this.getColor(student, device),
          tooltip: this.getTooltip(student),
        });
      });

      data.push({
        name: projectData.project.name,
        tag: null,
        studentData: studentData,
      });
    });

    return data;
  }

  getSelectData(): SelectData[] {
    const devices = Object.keys(Device);
    return devices.map(device => ({
      name: device,
      id: `${device}`,
      group: 'Device',
      reference: this,
    }));
  }

  private getDeviceCount(allocationData: AllocationData, device: Device): number {
    let deviceCount = 0;
    allocationData.projectsData.forEach(projectData => {
      projectData.students.forEach(student => {
        deviceCount += student.devices.filter(d => d === device).length;
      });
    });

    allocationData.studentsWithoutTeam.forEach(student => {
      deviceCount += student.devices.filter(d => d === device).length;
    });

    return deviceCount;
  }

  private getStudentCount(allocationData: AllocationData): number {
    return (
      allocationData.projectsData.reduce((acc, projectData) => acc + projectData.students.length, 0) +
      allocationData.studentsWithoutTeam.length
    );
  }

  private getTooltip(student): string {
    return student.firstName + ' ' + student.lastName;
  }

  private getColor(student: Student, device: Device): string {
    return student.devices.includes(device)
      ? ColorService.getSkillProficiencyColor(SkillProficiency.Advanced)
      : ColorService.getSkillProficiencyColor();
  }
}
