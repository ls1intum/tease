import {Component, OnDestroy, OnInit} from '@angular/core';
import {OverlayComponent, OverlayService} from '../../overlay.service';
import {Constraint, ConstraintType} from '../../shared/models/constraints/constraint';
import {ConstraintService} from '../../shared/layers/business-logic-layer/constraint.service';
import {Team} from "../../shared/models/team";
import {TeamGenerationService} from "../../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";

@Component({
  selector: 'app-confirmation-overlay',
  templateUrl: './confirmation-overlay.component.html',
  styleUrls: ['./confirmation-overlay.component.scss']
})
export class ConfirmationOverlayComponent implements OnInit, OverlayComponent {
  public data: {
    action: String,
    actionDescription: String,
    onConfirmed: (() => void),
    onCancelled: (() => void)};

  constructor() { }

  ngOnInit() {

  }
}
