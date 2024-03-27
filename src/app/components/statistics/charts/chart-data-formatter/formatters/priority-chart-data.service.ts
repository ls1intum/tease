import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { ChartDataFormatter } from '../chart-data-formatter';
import { Student } from 'src/app/api/models';
import { PeopleChartProjectData, PeopleChartStudentData } from '../people-chart-data';

@Injectable({
  providedIn: 'root',
})
export class PriorityChartDataService implements ChartDataFormatter {
  private readonly PRIORITY_ZONE_LABELS = ['High Priority', 'Medium Priority', 'Low Priority', 'Unassigned'];
  private readonly BACKGROUND_COLORS = ['#94DA7C', '#EED373', '#E16868', '#E0E0E0'];

  getDoughnutData(allocationData: AllocationData): ChartData<'doughnut', number[], unknown> {
    const priorityZoneCounts = new Map(this.PRIORITY_ZONE_LABELS.map(priority => [priority, 0]));

    allocationData.projectsData.forEach(projectData => {
      projectData.students.forEach(student => {
        const priority = this.getStudentPriorityForProject(student, projectData.project.id);
        const priorityZoneLabel = this.getPriorityZoneLabel(priority);
        const currentCount = priorityZoneCounts.get(priorityZoneLabel);
        priorityZoneCounts.set(priorityZoneLabel, currentCount + 1);
      });
    });

    priorityZoneCounts.set(this.PRIORITY_ZONE_LABELS[3], allocationData.studentsWithoutTeam.length);

    return {
      labels: this.PRIORITY_ZONE_LABELS,
      datasets: [
        {
          data: Array.from(priorityZoneCounts.values()),
          backgroundColor: this.BACKGROUND_COLORS,
        },
      ],
    };
  }

  getPeopleData(allocationData: AllocationData): PeopleChartProjectData[] {
    const data: PeopleChartProjectData[] = [];

    allocationData.projectsData.forEach(projectData => {
      const studentData: PeopleChartStudentData[] = [];
      const studentPriorities: number[] = [];

      projectData.students
        .map(student => {
          const priority = this.getStudentPriorityForProject(student, projectData.project.id);
          const color = this.getColorForPriority(priority);
          const tooltip = this.getTooltip(student.firstName, student.lastName, priority);
          studentPriorities.push(priority);
          return { priority, color, tooltip };
        })
        .sort((a, b) => a.priority - b.priority)
        .forEach(student => studentData.push({ color: student.color, tooltip: student.tooltip }));

      const peopleChartData = {
        name: projectData.project.name,
        tag: this.getTag(studentPriorities),
        studentData: studentData,
      };

      data.push(peopleChartData);
    });

    return data;
  }

  private getPriorityZone(priority: number): number {
    if (priority <= 2) {
      return 0;
    } else if (priority === 3) {
      return 1;
    } else if (priority >= 4) {
      return 2;
    }
    return 3;
  }

  private getPriorityZoneLabel(priority: number): string {
    const priorityZone = this.getPriorityZone(priority);
    return this.PRIORITY_ZONE_LABELS[priorityZone];
  }

  private getStudentPriorityForProject(student: Student, projectId: string): number {
    return student.projectPreferences.find(project => project.projectId === projectId)?.priority + 1 ?? 0;
  }

  private getColorForPriority(priority: number): string {
    const priorityZone = this.getPriorityZone(priority);
    return this.BACKGROUND_COLORS[priorityZone];
  }

  private getTag(priorities: number[]): string {
    return 'Ø ' + (priorities.reduce((acc, priority) => acc + priority, 0) / priorities.length || 0).toFixed(1);
  }

  private getTooltip(firstName: string, lastName: string, priority: number): string {
    return firstName + ' ' + lastName + ': ' + priority;
  }
}
