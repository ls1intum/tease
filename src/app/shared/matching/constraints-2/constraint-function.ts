import { Student } from 'src/app/api/models';
import { Operator } from '../constraints/constraint-utils';
import { v4 as uuidv4 } from 'uuid';

export abstract class ConstraintFunction {
  constructor(
    protected readonly students: Student[],
    protected readonly projectId: string,
    readonly id: string = uuidv4()
  ) {}

  abstract getConstraintFunction(): string;

  abstract getProperties(): SelectGroup;

  abstract getValues(): SelectData[];

  getOperators(): SelectData[] {
    return Object.values(Operator).map(operator => ({ value: operator, name: operator }));
  }
}

export class SelectData {
  name: string; //shown in the dropdown
  value: string; //value to be used in the constraint
}

export class SelectGroup {
  name: string;
  id: string;
  values: SelectData[];
}
