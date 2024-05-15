import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { ChartDataFormatter } from '../chart-data-formatter';
import { ColorService } from 'src/app/shared/constants/color.service';
import { SkillProficiency, Student } from 'src/app/api/models';
import { Comparator, Operator, SkillLevels } from 'src/app/shared/matching/constraints/constraint-utils';
import { PeopleChartProjectData, PeopleChartStudentData } from '../people-chart-data';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';

@Injectable({
  providedIn: 'root',
})
export class IntroCourseProficiencyChartDataService implements ChartDataFormatter {
  private readonly SKILL_PROFICIENCY_LABELS = Object.values(SkillProficiency);
  private readonly BACKGROUND_COLORS = [...ColorService.getSkillProficiencyColors()];

  getSelectData(): SelectData[] {
    return [
      { name: 'Intro Course Proficiency', id: 'statistics-intro-course-proficiency', group: 'Other', reference: this },
    ];
  }

  getDoughnutData(allocationData: AllocationData, id: string): ChartData<'doughnut', number[], unknown> {
    const skillProficienciesMap = new Map(this.SKILL_PROFICIENCY_LABELS.map(skill => [skill, 0]));

    let students = allocationData.projectsData.flatMap(projectData => projectData.students);
    students = students.concat(allocationData.studentsWithoutTeam);
    students.forEach(student => this.updateSkillProficiencyCount(skillProficienciesMap, student));

    const datasets = [
      {
        data: Array.from(skillProficienciesMap.values()),
        backgroundColor: this.BACKGROUND_COLORS,
      },
    ];

    return { labels: this.SKILL_PROFICIENCY_LABELS, datasets: datasets };
  }

  getPeopleData(allocationData: AllocationData, id: string): PeopleChartProjectData[] {
    const data: PeopleChartProjectData[] = [];

    allocationData.projectsData.forEach(projectData => {
      const studentData: PeopleChartStudentData[] = [];

      const students = [...projectData.students].sort((a, b) =>
        Comparator[Operator.GREATER_THAN_OR_EQUAL](
          SkillLevels[a.introCourseProficiency],
          SkillLevels[b.introCourseProficiency]
        )
          ? -1
          : 1
      );

      students.forEach(student => {
        studentData.push({
          color: ColorService.getSkillProficiencyColor(student.introCourseProficiency),
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

  private updateSkillProficiencyCount(skillProficienciesMap: Map<SkillProficiency, number>, student: Student): void {
    const skillProficiency = student.introCourseProficiency;
    const skillProficiencyCount = skillProficienciesMap.get(skillProficiency);
    skillProficienciesMap.set(skillProficiency, skillProficiencyCount + 1);
  }

  private getTooltip(student): string {
    return student.firstName + ' ' + student.lastName + ': ' + student.introCourseProficiency;
  }
}
