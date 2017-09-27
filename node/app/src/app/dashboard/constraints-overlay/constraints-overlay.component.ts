import {Component, OnDestroy, OnInit} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {Constraint, ConstraintType} from '../../shared/models/constraints/constraint';
import {ConstraintService} from '../../shared/layers/business-logic-layer/constraint.service';

@Component({
  selector: 'app-constraints-overlay',
  templateUrl: './constraints-overlay.component.html',
  styleUrls: ['./constraints-overlay.component.scss']
})
export class ConstraintsOverlayComponent implements OnInit, OnDestroy, OverlayComponent {
  public data: {};

  protected constraints: Constraint[];

  constructor(private constraintService: ConstraintService) { }

  ngOnInit() {
    this.constraintService.fetchConstraints().then(constraints => {
      this.constraints = constraints;
    });
  }

  ngOnDestroy(): void {
    this.constraintService.saveConstraints(this.constraints);
  }
}
