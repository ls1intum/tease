import { Student } from './student';
import { DeviceType } from './generated-model/device';

export class Team {
  name: string;
  students: Student[] = [];

  constructor(name: string) {
    this.name = name;
  }

  remove(student: Student) {
    const index = this.students.indexOf(student);
    if (index < 0) return;

    this.students.splice(index, 1);
    student.team = undefined;
  }

  add(student: Student) {
    this.students.push(student);
    student.team = this;
  }

  clear() {
    while (this.students.length !== 0) {
      const student: Student = this.students.pop();
      student.team = null;
    }
  }

  getDeviceCountOfType(device: DeviceType): number {
    return this.students.reduce(
      (acc, student) => acc.concat(student.devices.filter(curDevice => curDevice === device)),
      []
    ).length;
  }
}
