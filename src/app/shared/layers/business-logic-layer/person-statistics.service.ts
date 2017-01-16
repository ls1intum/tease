import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
/**
 * Created by Malte Bucksch on 13/01/2017.
 */

@Injectable()
export class PersonStatisticsService {
  getRatedPersonCount(persons: Person[]): number {
    return persons.filter(p => p.hasSupervisorRating()).length;
  }

  getNumberOfPersonsForPriority(priorityNumber: number, team: Team){
    return this.getPersonsForTeamPriority(team, priorityNumber).length;
  }

  private getPersonsForTeamPriority(team: Team, priorityNumber: number) {
    return team.persons.filter(person => {
      if (person.teamPriorities.length < priorityNumber)return false;
      return person.teamPriorities[priorityNumber - 1] === team;
    });
  }

  getPriorityCountMax(team: Team): number {
    return Math.max(...team.persons
      .map(person => person.teamPriorities.length));
  }
}
