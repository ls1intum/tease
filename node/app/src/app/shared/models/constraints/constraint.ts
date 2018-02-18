import {Team} from '../team';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export abstract class Constraint {

  public isEnabled: boolean;

  protected minValue: number;
  protected maxValue: number;
  protected teamName: string; // if defined, then the constraint only applies to that team

  protected constructor(config: any) {
    if (config && typeof config === 'object') {
      this.minValue = config.minValue ? config.minValue : NaN;
      this.maxValue = config.maxValue ? config.maxValue : NaN;
      this.isEnabled = config.isEnabled;
      this.teamName = config.teamName;
    }
  }

  abstract isSatisfied(team: Team): boolean;

  calculateSatisfactionScore(team: Team): number {
    return this.isSatisfied(team) ? 10 : 0;
  }

  abstract getName(): string;

  abstract getType(): ConstraintType;

  abstract getCurrentValue(team: Team): number;

  toString(): string {
    let str = '';

    const isLeftSideDefined = typeof this.getMinValue() === 'number';
    const isRightSideDefined = typeof this.getMaxValue() === 'number';

    // left-hand side
    if (this.getType() === ConstraintType.Interval) {
      if (isLeftSideDefined) {
        str += this.getMinValue() + ' ' + this.getComparator() + ' ';
      }
    }

    // middle
    str += this.getName();

    // right-hand side
    if ([ConstraintType.GT, ConstraintType.GTE].indexOf(this.getType()) !== -1) {
      if (isLeftSideDefined) {
        str += ' ' + this.getComparator() + ' ' + this.getMinValue();
      }
    } else {
      if (isRightSideDefined) {
        str += ' ' + this.getComparator() + ' ' + this.getMaxValue();
      }
    }

    return str;
  }

  getMinValue(): number {
    return this.minValue;
  }

  getMaxValue(): number {
    return this.maxValue;
  }

  getRightSideValue(): number {
    if (this.getType() === ConstraintType.GT || this.getType() === ConstraintType.GTE) {
      return this.getMinValue();
    } else {
      return this.getMaxValue();
    }
  }

  getTeamName(): string {
    return this.teamName;
  }

  setMinValue(value: number) {
    this.minValue = value;
  }

  setMaxValue(value: number) {
    this.maxValue = value;
  }

  getComparator(): string {
    switch (this.getType()) {
      case ConstraintType.GT:
        return '>';
      case ConstraintType.GTE:
        return '≥';
      case ConstraintType.LT:
        return '<';
      case ConstraintType.LTE:
        return '≤';
      case ConstraintType.Interval:
        return '≤'; // Should be treated in a special way
    }
  }

  getWarnings(): string[] {
    if (!this.isEnabled)
      return [];

    const warnings: string[] = [];

    const minNumberPositiveWarning = 'the minimum value must be positive';
    const minNaNWarning = 'the minimum value must be a number';
    const maxNumberPositiveWarning = 'the maximum value must be positive';
    const maxNaNWarning = 'the maximum value must be a number';
    const intervalWarning = 'the minimum value must be smaller than the maximum value';

    if ([ConstraintType.GT, ConstraintType.GTE, ConstraintType.Interval].indexOf(this.getType()) !== -1) {
      if (isNaN(this.minValue))
        warnings.push(minNaNWarning);
      else if (this.minValue < 0)
        warnings.push(minNumberPositiveWarning);
    }

    if ([ConstraintType.LT, ConstraintType.LTE, ConstraintType.Interval].indexOf(this.getType()) !== -1) {
      if (isNaN(this.maxValue))
        warnings.push(maxNaNWarning);
      else if (this.maxValue < 0)
        warnings.push(maxNumberPositiveWarning);
    }

    if (this.getType() === ConstraintType.Interval) {
      if (!isNaN(this.minValue) && !isNaN(this.maxValue) && this.minValue > this.maxValue)
        warnings.push(intervalWarning);
    }

    return warnings;
  }

  hasWarnings(): boolean {
    return this.getWarnings().length !== 0;
  }
}

export enum ConstraintType {
  GT, GTE, LT, LTE, Interval
}
