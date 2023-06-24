import { Component, Input, OnInit } from '@angular/core';
import { Constraint, ConstraintType } from '../../shared/models/constraints/constraint';
import { Project } from '../../shared/models/project';

@Component({
  selector: 'app-constraint',
  templateUrl: './constraint.component.html',
  styleUrls: ['./constraint.component.scss'],
})
export class ConstraintComponent implements OnInit {
  @Input() constraint: Constraint;
  ConstraintType = ConstraintType;

  constructor() {}

  ngOnInit() {}

  protected onConstraintMinValueChanged(value) {
    this.constraint.setMinValue(value === '' ? NaN : +value);
  }

  protected onConstraintMaxValueChanged(value) {
    this.constraint.setMaxValue(value === '' ? NaN : +value);
  }

  getMinValue(): string {
    if (!this.constraint.getMinValue() || isNaN(this.constraint.getMinValue())) return '';
    return this.constraint.getMinValue().toString();
  }

  getMaxValue(): string {
    if (!this.constraint.getMaxValue() || isNaN(this.constraint.getMaxValue())) return '';
    return this.constraint.getMaxValue().toString();
  }
}
