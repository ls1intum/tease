import {Person} from "./person";
import {Project} from "./project";
/**
 * Created by wanur on 05/11/2016.
 */

export class Team {
  name: string;
  static readonly OrphanTeamName = "NO_TEAM";

  id: number;
  persons: Person[] = [];
  project: Project;

  constructor(name: string) {
  }

  remove(person: Person) {
    let index = this.persons.indexOf(person);
    if (index < 0)return;

    this.persons.splice(index, 1);
    person.team = undefined;
  }

  add(person: Person) {
    this.persons.push(person);
    person.team = this;
  }
}
