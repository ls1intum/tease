import { Injectable } from '@angular/core';
import { Person } from '../../models/person';
import { Team } from '../../models/team';
import { ArrayHelper } from '../../helpers/array.helper';
import { Constraint } from '../../models/constraints/constraint';
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

@Injectable()
export class PersonStatisticsService {
  getRatedPersonCount(persons: Person[]): number {
    return persons.filter(p => p.hasSupervisorRating()).length;
  }

  getNumberOfPersonsForPriority(priorityNumber: number, team: Team): number {
    return this.getPersonsForTeamPriority(team, priorityNumber).length;
  }

  calcTeamQualityScore(team: Team, constraints: Constraint[]): number {
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

  getAverageTeamPriorityOfPersons(team: Team): number {
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
  private getPersonsForTeamPriority(team: Team, priorityNumber: number): Person[] {
    return team.persons.filter(person => {
      if (person.teamPriorities.length < priorityNumber) return false;
      return person.teamPriorities[priorityNumber] === team.name;
    });
  }

  getPriorityCountMax(team: Team): number {
    if (team.persons.length === 0) return 0;

    return Math.max(...team.persons.map(person => person.teamPriorities.length));
  }
}
