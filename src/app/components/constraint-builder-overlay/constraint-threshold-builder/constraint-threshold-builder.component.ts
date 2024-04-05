import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ThresholdWrapper } from 'src/app/shared/matching/constraints/constraint';

@Component({
  selector: 'app-constraint-threshold-builder',
  templateUrl: './constraint-threshold-builder.component.html',
  styleUrl: './constraint-threshold-builder.component.scss',
})
export class ConstraintThresholdBuilderComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private subscriptions: Subscription[] = [];
  @Output() thresholdChange = new EventEmitter<ThresholdWrapper>();

  constructor(private studentsService: StudentsService) {}

  ngOnInit(): void {
    const maxValue = this.studentsService.getStudents().length;
    this.form = new FormGroup({
      lowerBound: new FormControl<number>(0, [this.integerValidator, this.positiveValidator]),
      upperBound: new FormControl<number>(maxValue, [this.integerValidator, this.positiveValidator]),
    });
    this.thresholdChange.emit(new ThresholdWrapper(0, maxValue));

    this.subscriptions.push(
      this.form.valueChanges.subscribe(() => {
        if (this.form.invalid) {
          this.thresholdChange.emit(null);
          return;
        }
        const lowerBound = this.form.get('lowerBound').value;
        const upperBound = this.form.get('upperBound').value;
        this.thresholdChange.emit(new ThresholdWrapper(lowerBound, upperBound));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe());
  }

  positiveValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value >= 0 ? null : { notPositive: true };
  };

  integerValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return Number.isInteger(value) ? null : { notInteger: true };
  };
}
