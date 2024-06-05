import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const positiveValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return value >= 0 ? null : { notPositive: true };
};

export const integerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return Number.isInteger(value) ? null : { notInteger: true };
};
