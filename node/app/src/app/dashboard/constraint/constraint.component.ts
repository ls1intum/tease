import {Component, Input, OnInit} from '@angular/core';
import {Constraint, ConstraintType} from '../../shared/models/constraints/constraint';
import {Team} from '../../shared/models/team';

@Component({
  selector: 'app-constraint',
  templateUrl: './constraint.component.html',
  styleUrls: ['./constraint.component.scss']
})
export class ConstraintComponent implements OnInit {
  @Input() constraint: Constraint;
  ConstraintType = ConstraintType;

  constructor() { }

  ngOnInit() {
  }

  protected onConstraintMinValueChanged(constraint: Constraint, value) {
    if (value === '') {
      constraint.setMinValue(value);
    } else if (!isNaN(+value)) {
      constraint.setMinValue(+value);
    }
  }

  protected onConstraintMaxValueChanged(constraint: Constraint, value) {
    if (value === '') {
      constraint.setMaxValue(value);
    } else if (!isNaN(+value)) {
      constraint.setMaxValue(+value);
    }
  }
}
