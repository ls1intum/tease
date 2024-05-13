import { Student } from 'src/app/api/models';
import { Operator } from './constraint-utils';

export class ConstraintWrapper {
  constructor(
    readonly projectIds: string[],
    readonly constraintFunction: ConstraintFunctionWrapper,
    readonly threshold: ThresholdWrapper,
    readonly id: string,
    public isActive: boolean = true
  ) {}
}

export class ConstraintFunctionWrapper {
  constructor(
    readonly property: string,
    readonly propertyId: string,
    readonly operator: Operator,
    readonly value: string,
    readonly valueId: string,
    readonly students: Student[]
  ) {}
}

export class ThresholdWrapper {
  constructor(
    readonly lowerBound: number,
    readonly upperBound: number
  ) {}
}
