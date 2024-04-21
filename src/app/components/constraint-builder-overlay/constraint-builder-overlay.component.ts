import { Component } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import {
  ConstraintFunctionWrapper,
  ConstraintWrapper,
  ThresholdWrapper,
} from 'src/app/shared/matching/constraints/constraint';
import { ConstraintSummaryViewComponent } from '../constraint-summary-view/constraint-summary-view.component';

@Component({
  selector: 'app-constraint-builder-overlay',
  templateUrl: './constraint-builder-overlay.component.html',
  styleUrl: './constraint-builder-overlay.component.scss',
})
export class ConstraintBuilderOverlayComponent implements OverlayComponent {
  data = {
    onClosed: () => {},
  };
  private projectIds: string[] = [];
  private constraintFunctionWrapper: ConstraintFunctionWrapper;
  private thresholdWrapper: ThresholdWrapper;
  isFormValid = false;

  constructor(private constraintsService: ConstraintsService) {}

  selectedProjectsChange(projectIds: string[]): void {
    this.projectIds = projectIds;
    this.updateFormValid();
  }

  constraintFunctionChange(constraintFunctionWrapper: ConstraintFunctionWrapper): void {
    this.constraintFunctionWrapper = constraintFunctionWrapper;
    this.updateFormValid();
  }

  thresholdChange(thresholdWrapper: ThresholdWrapper): void {
    this.thresholdWrapper = thresholdWrapper;
    this.updateFormValid();
  }

  private updateFormValid(): void {
    if (!this.projectIds.length || !this.constraintFunctionWrapper || !this.thresholdWrapper) {
      this.isFormValid = false;
      return;
    }
    this.isFormValid = true;
  }

  cancel(): void {
    this.openConstrainstView();
  }

  addConstraint(): void {
    if (!this.isFormValid) {
      return;
    }

    const constraint = new ConstraintWrapper(this.projectIds, this.constraintFunctionWrapper, this.thresholdWrapper);
    this.constraintsService.addConstraint(constraint);

    this.openConstrainstView();
  }

  private openConstrainstView(): void {
    this.data.onClosed();
  }
}
