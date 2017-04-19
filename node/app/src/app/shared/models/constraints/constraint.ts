import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export abstract class Constraint {

  public isEnabled;

  protected minValue: number;
  protected maxValue: number;
  protected teamName: string; // if defined, then the constraint only applies to that team

  protected constructor(config: any) {
    if (config && typeof config === 'object') {
      this.minValue = config.minValue;
      this.maxValue = config.maxValue;
      this.isEnabled = config.isEnabled;
      this.teamName = config.teamName;
    }
  }

  abstract isSatisfied(team: Team): boolean;

  abstract calculateSatisfactionScore(team: Team): number;

  abstract getName(): string;

  abstract getType(): ConstraintType;

  toString(): string {
    let str = '';

    let isLeftSideDefined = typeof this.getMinValue() !== 'undefined';
    let isRightSideDefined = typeof this.getMaxValue() !== 'undefined';

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
}

export enum ConstraintType {
  GT, GTE, LT, LTE, Interval
}
