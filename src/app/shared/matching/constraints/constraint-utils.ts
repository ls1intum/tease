export enum Operator {
  EQUALS = '==',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',
  NOT_EQUALS = '!=',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComparisonFunction = (a: any, b: any) => boolean;

export const Comparator: Record<Operator, ComparisonFunction> = {
  [Operator.EQUALS]: (a, b) => a === b,
  [Operator.GREATER_THAN_OR_EQUAL]: (a, b) => a >= b,
  [Operator.LESS_THAN_OR_EQUAL]: (a, b) => a <= b,
  [Operator.NOT_EQUALS]: (a, b) => a !== b,
};

export const OperatorMapping: Record<Operator, string> = {
  [Operator.EQUALS]: 'is equal to',
  [Operator.GREATER_THAN_OR_EQUAL]: 'at least',
  [Operator.LESS_THAN_OR_EQUAL]: 'at most',
  [Operator.NOT_EQUALS]: 'not equals',
};

import { LanguageProficiency } from 'src/app/api/models';
export const LanguageLevels: Record<string, number> = {
  [LanguageProficiency.A1A2]: 1,
  [LanguageProficiency.B1B2]: 2,
  [LanguageProficiency.C1C2]: 3,
  [LanguageProficiency.Native]: 4,
};

import { SkillProficiency } from 'src/app/api/models';
export const SkillLevels: Record<string, number> = {
  [SkillProficiency.Novice]: 1,
  [SkillProficiency.Intermediate]: 2,
  [SkillProficiency.Advanced]: 3,
  [SkillProficiency.Expert]: 4,
};

export const valueSeparator = '<#>';

export function mapTwoValues(studentId, projectId): string {
  return `${studentId}${valueSeparator}${projectId}`;
}

export function splitTwoValues(value: string): string[] {
  return value.split(valueSeparator);
}

export function getOperatorFromValue(value: string): Operator {
  return Object.values(Operator).find(operator => operator === value);
}
