import { Injectable } from '@angular/core';
import { Student } from '../../models/student';
import { Team } from '../../models/team';
import { ArrayHelper } from '../../helpers/array.helper';
import { Constraint } from '../../models/constraints/constraint';

@Injectable()
export class StudentStatisticsService {
  getRatedStudentCount(students: Student[]): number {
    return students.filter(p => p.hasSupervisorAssessment()).length;
  }

  getNumberOfStudentsForPriority(priorityNumber: number, team: Team): number {
    return this.getStudentsForTeamPriority(team, priorityNumber).length;
  }

  calcTeamQualityScore(team: Team, constraints: Constraint[]): number {
    const averagePrio = this.getAverageTeamPriorityOfStudents(team);
    const averagePrioScore = this.calcPrioScore(averagePrio);

    const scoreSum = constraints.reduce((sum, current) => {
      return sum + current.calculateSatisfactionScore(team);
    }, 0);
    const averageConstraintSatisfactionScore = scoreSum / constraints.length;

    if (constraints.length === 0) return averagePrioScore;
    if (isNaN(averagePrioScore)) return averageConstraintSatisfactionScore;

    return (averagePrioScore + averageConstraintSatisfactionScore) / 2;
  }

  private calcPrioScore(averagePrio: number): number {
    return Math.min(Math.max(10 - averagePrio, 0), 10);
  }

  getAverageTeamPriorityOfStudents(team: Team): number {
    const priorities = ArrayHelper.createNumberRange(this.getPriorityCountMax(team));

    let studentSum = 0;
    let prioSum = 0;
    for (const prio of priorities) {
      const studentsWithPrio = this.getNumberOfStudentsForPriority(prio, team);
      studentSum += studentsWithPrio;
      prioSum += (prio + 1) * studentsWithPrio;
    }

    return prioSum / studentSum;
  }

  private getStudentsForTeamPriority(team: Team, priorityNumber: number): Student[] {
    return team.students.filter(student => {
      if (student.projectPriorities.length < priorityNumber) return false;
      return student.projectPriorities[priorityNumber] === team;
    });
  }

  getPriorityCountMax(team: Team): number {
    if (team.students.length === 0) return 0;

    return Math.max(...team.students.map(student => student.projectPriorities.length));
  }
}
