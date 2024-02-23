import { StudentSkill } from 'src/app/api/models';
import { Comparator, Operator, SkillLevels } from '../constraint-utils';
import { ObjectConstraintFunction } from './object-constraint-function';

export class SkillsConstraintFunction extends ObjectConstraintFunction {
  constructor(operator: Operator, value: string, object_id: string) {
    super('skills', operator, value, object_id);
  }

  fulfillsConstraint(values: StudentSkill[]): boolean {
    for (const value of values) {
      if (value.id === this.object_id) {
        if (Comparator[this.operator](SkillLevels[value.proficiency], SkillLevels[this.value])) {
          return true;
        }
      }
    }
    return false;
  }
}
