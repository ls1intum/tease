import { Comparator, Operator, SkillLevels } from '../constraint-utils';
import { StudentConstraintFunction } from './student-constraint-function';

export class SkillConstraintFunction extends StudentConstraintFunction {
  constructor(key: 'introCourseProficiency' | 'introSelfAssessment', operator: Operator, value: string) {
    super(key, operator, value);
  }

  fulfillsConstraint(value: string): boolean {
    return Comparator[this.operator](SkillLevels[this.value], SkillLevels[value]);
  }
}
