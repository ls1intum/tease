import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import {
  ConstraintFunctionWrapper,
  ConstraintWrapper,
  ThresholdWrapper,
} from 'src/app/shared/matching/constraints/constraint';
import { v4 as uuid } from 'uuid';
import { Operator } from 'src/app/shared/matching/constraints/constraint-utils';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { facQuestionIcon } from 'src/assets/icons/icons';
import { ConstraintHelpComponent } from '../constraint-help/constraint-help.component';

@Component({
  selector: 'app-constraint-builder-overlay',
  templateUrl: './constraint-builder-overlay.component.html',
  styleUrl: './constraint-builder-overlay.component.scss',
})
export class ConstraintBuilderOverlayComponent implements OverlayComponent, OnInit {
  facQuestionIcon = facQuestionIcon;
  data: {
    constraintWrapper: ConstraintWrapper;
    onClosed: () => {};
  };
  id: string;
  projectsSelectData: SelectData[] = [];
  projectIds: string[] = [];
  constraintFunctionWrapper: ConstraintFunctionWrapper;
  thresholdWrapper: ThresholdWrapper;
  isFormValid = false;

  constructor(
    private constraintsService: ConstraintsService,
    private projectsService: ProjectsService,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    this.projectsSelectData = this.projectsService.getProjects().map(project => ({
      id: project.id,
      name: project.name,
    }));

    if (this.data.constraintWrapper) {
      const constraintWrapper = this.data.constraintWrapper;
      this.projectIds = constraintWrapper.projectIds;
      this.constraintFunctionWrapper = constraintWrapper.constraintFunction;
      this.thresholdWrapper = constraintWrapper.threshold;
      this.id = constraintWrapper.id;
    } else {
      this.constraintFunctionWrapper = new ConstraintFunctionWrapper('', '', null, '', '', []);
      this.thresholdWrapper = new ThresholdWrapper(0, 10);
    }
  }

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

    const constraint = this.createConstraintWrapper(false);
    this.constraintsService.replaceConstraint(this.id, constraint);

    this.openConstrainstView();
  }

  private openConstrainstView(): void {
    this.data.onClosed();
  }

  showConstraintHelpOverlay(): void {
    this.cancel();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintHelpComponent, {
        constraintWrapper: this.createConstraintWrapper(true),
        onClosed: this.data.onClosed,
      });
    }, 10);
  }

  private createConstraintWrapper(tempConstraint: Boolean): ConstraintWrapper {
    return new ConstraintWrapper(
      this.projectIds,
      this.constraintFunctionWrapper,
      this.thresholdWrapper,
      tempConstraint ? this.id : uuid()
    );
  }
}
