import { Language } from 'src/app/api/models';
import { Comparator, Operator, LanguageLevels } from '../constraint-utils';
import { ObjectConstraintFunction } from './object-constraint-function';

export class LanguagesConstraintFunction extends ObjectConstraintFunction {
  constructor(operator: Operator, value: string, object_value: string) {
    super('languages', operator, value, object_value);
  }

  fulfillsConstraint(values: Language[]): boolean {
    for (const value of values) {
      if (value.language === this.object_id) {
        if (Comparator[this.operator](LanguageLevels[value.proficiency], LanguageLevels[this.value])) {
          return true;
        }
      }
    }
    return false;
  }
}
