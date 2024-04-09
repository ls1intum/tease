import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ThresholdWrapper } from 'src/app/shared/matching/constraints/constraint';
import { integerValidator, positiveValidator } from 'src/app/shared/utils/validators.utils';

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
      lowerBound: new FormControl<number>(0, [integerValidator, positiveValidator]),
      upperBound: new FormControl<number>(maxValue, [integerValidator, positiveValidator]),
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
}
