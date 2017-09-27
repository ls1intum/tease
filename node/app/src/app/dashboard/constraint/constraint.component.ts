import {Component, Input, OnInit} from '@angular/core';
import {Constraint, ConstraintType} from '../../shared/models/constraints/constraint';
import {Team} from "../../shared/models/team";

@Component({
  selector: 'app-constraint',
  templateUrl: './constraint.component.html',
  styleUrls: ['./constraint.component.scss']
})
export class ConstraintComponent implements OnInit {
  @Input() protected constraint: Constraint;
  protected ConstraintType = ConstraintType;
  protected SpecialTeamNameForGlobalConstraints = Team.SpecialTeamNameForGlobalConstraints;

  constructor() { }

  ngOnInit() {
  }

}
