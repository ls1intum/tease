import { Student } from './student';
import { Device } from './device';
/**
 * Created by wanur on 05/11/2016.
 */

export class Team {
  name: string;
  persons: Student[] = [];

  constructor(name: string) {
    this.name = name;
  }

  remove(person: Student) {
    const index = this.persons.indexOf(person);
    if (index < 0) return;

    this.persons.splice(index, 1);
    person.team = undefined;
  }

  add(person: Student) {
    this.persons.push(person);
    person.team = this;
  }

  clear() {
    while (this.persons.length !== 0) {
      const person: Student = this.persons.pop();
      person.team = null;
    }
  }

  getDeviceCountOfType(device: Device): number {
    return this.persons.reduce(
      (acc, person) => acc.concat(person.devices.filter(curDevice => curDevice === device)),
      []
    ).length;
  }
}
