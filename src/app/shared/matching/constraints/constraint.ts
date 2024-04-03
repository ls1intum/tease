import { Student } from 'src/app/api/models';

export class ConstraintWrapper {
  constructor(
    readonly constraint: string[],
    readonly students: Student[],
    readonly projectIds: string[],
    readonly constraintFunctionProperty: string,
    readonly constraintFunctionOperator: string,
    readonly constraintFunctionValue: string,
    readonly constraintOperator: string,
    readonly constraintThreshold: number
  ) {}
}
