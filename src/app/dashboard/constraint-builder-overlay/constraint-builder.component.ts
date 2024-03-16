import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';

import {
  PropertySelectGroup,
  SelectData,
} from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ConstraintBuilderService } from 'src/app/shared/matching/constraints/constraint-builder';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ConstraintMappingService } from 'src/app/shared/data/constraint-mapping.service';

@Component({
  selector: 'app-constraint-builder',
  templateUrl: './constraint-builder.component.html',
  styleUrl: './constraint-builder.component.scss',
})
export class ConstraintBuilderComponent implements OverlayComponent, OnInit {
  // change OverlayComponent in future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  constraintFunctionProperties: PropertySelectGroup[];
  constraintFunctionOperatorSelectData: SelectData[];
  constraintFunctionValueSelectData: SelectData[];
  constraintProjectSelectData: SelectData[];
  constraintOperators: SelectData[];

  selectedConstraintFunctionProperty: string;
  selectedConstraintFunctionOperator: string;
  selectedConstraintFunctionValue: string;
  selectedConstraintProject: string;
  selectedConstraintOperator: string;
  constraintThresholdValue: number;

  constraint?: ConstraintWrapper;

  constructor(
    private constraintsService: ConstraintsService,
    private overlayService: OverlayService,
    private constraintGenerator: ConstraintBuilderService
  ) {}

  ngOnInit(): void {
    this.constraintFunctionProperties = this.constraintGenerator.constraintFunctionProperties;

    this.constraintProjectSelectData = this.constraintGenerator.constraintProjects;
    this.selectedConstraintProject = this.constraintProjectSelectData[0].id;

    this.constraintOperators = this.constraintGenerator.constraintOperators;
    this.selectedConstraintOperator = this.constraintOperators[0].id;
  }

  selectData(): void {
    this.getConstraintFunctionValues();
    this.getConstraintFunctionOperators();
    this.getConstraint();
  }

  private getConstraintFunctionValues(): void {
    this.constraintFunctionValueSelectData = this.constraintGenerator.getConstraintFunctionValues(
      this.selectedConstraintFunctionProperty
    );

    if (this.constraintFunctionValueSelectData || !this.constraintFunctionValueSelectData.length) {
      this.selectedConstraintFunctionValue = null;
    }
    this.selectedConstraintFunctionValue = this.constraintFunctionValueSelectData[0].id;
  }

  private getConstraintFunctionOperators(): void {
    this.constraintFunctionOperatorSelectData = this.constraintGenerator.getConstraintFunctionOperators(
      this.selectedConstraintFunctionProperty
    );

    if (this.constraintFunctionOperatorSelectData || !this.constraintFunctionOperatorSelectData.length) {
      this.selectedConstraintFunctionOperator = null;
    }
    this.selectedConstraintFunctionOperator = this.constraintFunctionOperatorSelectData[0].id;
  }

  getConstraint(): void {
    if (
      !this.selectedConstraintProject ||
      !this.selectedConstraintFunctionProperty ||
      !this.selectedConstraintFunctionOperator ||
      !this.selectedConstraintFunctionValue ||
      !this.selectedConstraintOperator ||
      !this.constraintThresholdValue
    ) {
      return;
    }

    this.constraint = this.constraintGenerator.createConstraint(
      this.selectedConstraintProject,
      this.selectedConstraintFunctionProperty,
      this.selectedConstraintFunctionOperator,
      this.selectedConstraintFunctionValue,
      this.selectedConstraintOperator,
      this.constraintThresholdValue
    );
  }

  storeConstraint(): void {
    if (this.constraint) {
      this.constraintsService.addConstraint(this.constraint);
      this.overlayService.closeOverlay();
    }
  }
}
