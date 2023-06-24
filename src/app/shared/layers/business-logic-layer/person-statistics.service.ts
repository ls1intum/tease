import { Injectable } from '@angular/core';
import { Student } from '../../models/student';
import { Project } from '../../models/project';
import { ArrayHelper } from '../../helpers/array.helper';
import { Constraint } from '../../models/constraints/constraint';
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

@Injectable()
export class PersonStatisticsService {
  getRatedPersonCount(persons: Student[]): number {
    return persons.filter(p => p.hasSupervisorAssessment()).length;
  }

  getNumberOfPersonsForPriority(priorityNumber: number, team: Project): number {
    return this.getPersonsForTeamPriority(team, priorityNumber).length;
  }

  calcTeamQualityScore(team: Project, constraints: Constraint[]): number {
    const averagePrio = this.getAverageTeamPriorityOfPersons(team);
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

  getAverageTeamPriorityOfPersons(team: Project): number {
    const priorities = ArrayHelper.createNumberRange(this.getPriorityCountMax(team));

    let personSum = 0;
    let prioSum = 0;
    for (const prio of priorities) {
      const personsWithPrio = this.getNumberOfPersonsForPriority(prio, team);
      personSum += personsWithPrio;
      prioSum += (prio + 1) * personsWithPrio;
    }

    return prioSum / personSum;
  }

  private getPersonsForTeamPriority(team: Project, priorityNumber: number): Student[] {
    return team.persons.filter(person => {
      if (person.teamPriorities.length < priorityNumber) return false;
      return person.teamPriorities[priorityNumber] === team;
    });
  }

  getPriorityCountMax(team: Project): number {
    if (team.persons.length === 0) return 0;

    return Math.max(...team.persons.map(person => person.teamPriorities.length));
  }
}
