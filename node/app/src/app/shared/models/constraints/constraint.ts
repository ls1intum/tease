import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export abstract class Constraint {

  public isEnabled = true;

  protected minValue: number;
  protected maxValue: number;

  protected constructor(config: any) {
    if (config && typeof config === 'object') {
      this.minValue = config.minValue;
      this.maxValue = config.maxValue;
      this.isEnabled = config.isEnabled;
    }
  }

  abstract isSatisfied(team: Team): boolean;

  abstract calculateSatisfactionScore(team: Team): number;

  abstract getName(): string;

  abstract getType(): ConstraintType;

  abstract toString(): string;

  getMinValue(): number {
    return this.minValue;
  }

  getMaxValue(): number {
    return this.maxValue;
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
        return '>=';
      case ConstraintType.LT:
        return '<';
      case ConstraintType.LTE:
        return '<=';
      case ConstraintType.Interval:
        return '<='; // Should be treated in a special way
    }
  }
}

export enum ConstraintType {
  GT, GTE, LT, LTE, Interval
}
