import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
import {ArrayHelper} from "../../helpers/array.helper";
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

  getAverageTeamPriorityOfPersons(team: Team): number {
    let priorities = ArrayHelper.createNumberRange(this.getPriorityCountMax(team));

    let personSum = 0;
    let prioSum = 0;
    for (let prio of priorities) {
      let personsWithPrio = this.getNumberOfPersonsForPriority(prio, team);
      personSum += personsWithPrio;
      prioSum += (prio+1) * personsWithPrio;
    }

    return prioSum / personSum;
  }

  private getPersonsForTeamPriority(team: Team, priorityNumber: number): Person[] {
    return team.persons.filter(person => {
      if (person.teamPriorities.length < priorityNumber)return false;
      return person.teamPriorities[priorityNumber] === team;
    });
  }

  getPriorityCountMax(team: Team): number {
    if (team.persons.length == 0)return 0;

    return Math.max(...team.persons
      .map(person => person.teamPriorities.length));
  }
}
