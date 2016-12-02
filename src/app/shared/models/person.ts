import {Team} from "./team";
/**
 * Created by wanur on 05/11/2016.
 */

export class Person {
  id: number;
  firstName: string;
  lastName: string;
  major: string;
  team: Team;
  supervisorRating: number;
  teamPriorities: Team[] = [];

  constructor(id?: number, firstName?: string){
    this.id = id || 0;
    this.firstName = firstName || "no name";
  }

  getTeamPriority(team: Team): number {
    return this.teamPriorities.indexOf(team) + 1;
  }
}
