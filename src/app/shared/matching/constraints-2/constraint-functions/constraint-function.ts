import { Skill, Student } from 'src/app/api/models';
import { Operator, mapTwoValues } from '../constraint-utils';
import { v4 as uuidv4 } from 'uuid';

export abstract class ConstraintFunction {
  constructor(
    protected readonly students: Student[],
    protected readonly skills: Skill[],
    readonly id: string = uuidv4()
  ) {}

  abstract getConstraintFunction(projectId: string, property: string, operator: Operator, value: string): string;

  abstract getProperties(): SelectGroup;

  abstract getValues(): SelectData[];

  getOperators(): SelectData[] {
    return Object.values(Operator).map(operator => ({ value: operator, name: operator }));
  }

  protected combineStudentAndProjects(projectId: string, students: Student[]): string {
    return students.map(student => mapTwoValues(student.id, projectId)).join(' + ');
  }
}

export class SelectData {
  name: string; //shown in the dropdown
  value: string; //value to be used in the constraint
}

export class SelectGroup {
  name: string;
  values: SelectData[];
}
