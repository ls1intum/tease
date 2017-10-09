import {Person} from './person';
import {Project} from './project';
import {Device} from "./device";
/**
 * Created by wanur on 05/11/2016.
 */

export class Team {
  static readonly OrphanTeamName = 'NO_TEAM';
  static readonly SpecialTeamNameForGlobalConstraints = '<GlobalConstraints>';
  name: string;

  id: number;
  persons: Person[] = [];
  project: Project;

  constructor(name: string) {
    this.name = name;
  }

  remove(person: Person) {
    const index = this.persons.indexOf(person);
    if (index < 0)return;

    this.persons.splice(index, 1);
    person.team = undefined;
  }

  add(person: Person) {
    this.persons.push(person);
    person.team = this;
  }

  clear() {
    while (this.persons.length !== 0) {
      const person: Person = this.persons.pop();
      person.team = undefined;
    }
  }

  getDeviceCountOfType(device: Device): number {
    return this.persons
      .reduce((acc, person) => acc.concat(person.devices.filter(curDevice => curDevice === device)), [])
      .length;
  }
}
