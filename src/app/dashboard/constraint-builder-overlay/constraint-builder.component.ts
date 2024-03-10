import { Component, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';

import {
  PropertySelectGroup,
  SelectData,
} from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ConstraintBuilder } from 'src/app/shared/matching/constraints/constraint-builder';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { valueSeparator } from 'src/app/shared/matching/constraints/constraint-utils';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ConstraintMappingService } from 'src/app/shared/data/constraint-mapping.service';

@Component({
  selector: 'app-constraints-overlay-2',
  templateUrl: './constraint-builder.component.html',
  styleUrl: './constraint-builder.component.css',
})
export class ConstraintBuilderComponent implements OverlayComponent, OnInit {
  // change OverlayComponent in future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  constructor(
    private studentsService: StudentsService,
    private skillsService: SkillsService,
    private projectsService: ProjectsService,
    private constraintsService: ConstraintsService,
    private constraintMappingService: ConstraintMappingService,
    private overlayService: OverlayService,
    private constraintGenerator: ConstraintBuilder
  ) {}

  ngOnInit(): void {
    this.constraintFunctionProperties = this.constraintGenerator.constraintFunctionProperties;

    this.constraintProjectSelectData = this.constraintGenerator.constraintProjects;
    this.constraintProjectSelected = this.constraintProjectSelectData[0].id;

    this.constraintOperators = this.constraintGenerator.constraintOperators;
    this.constraintOperatorSelected = this.constraintOperators[0].id;
  }

  constraintFunctionProperties: PropertySelectGroup[];
  constraintFunctionOperatorSelectData: SelectData[];
  constraintFunctionValueSelectData: SelectData[];
  constraintProjectSelectData: SelectData[];
  constraintOperators: SelectData[];

  constraintFunctionPropertySelected: string;
  constraintFunctionOperatorSelected: string;
  constraintFunctionValueSelected: string;
  constraintProjectSelected: string;
  constraintOperatorSelected: string;
  constraintThresholdValue: number;

  selectData(): void {
    this.getConstraintFunctionValues();
    this.getConstraintFunctionOperators();
    this.getConstraint();
  }

  private getConstraintFunctionValues(): void {
    this.constraintFunctionValueSelectData = this.constraintGenerator.getConstraintFunctionValues(
      this.constraintFunctionPropertySelected
    );

    if (this.constraintFunctionValueSelectData || this.constraintFunctionValueSelectData.length < 1) {
      this.constraintFunctionValueSelected = null;
    }
    this.constraintFunctionValueSelected = this.constraintFunctionValueSelectData[0].id;
  }

  private getConstraintFunctionOperators(): void {
    this.constraintFunctionOperatorSelectData = this.constraintGenerator.getConstraintFunctionOperators(
      this.constraintFunctionPropertySelected
    );

    if (this.constraintFunctionOperatorSelectData || this.constraintFunctionOperatorSelectData.length < 1) {
      this.constraintFunctionOperatorSelected = null;
    }
    this.constraintFunctionOperatorSelected = this.constraintFunctionOperatorSelectData[0].id;
  }

  constraint: ConstraintWrapper | null = null;

  getConstraint(): void {
    this.constraint = null;
    if (
      !this.constraintProjectSelected ||
      !this.constraintFunctionPropertySelected ||
      !this.constraintFunctionOperatorSelected ||
      !this.constraintFunctionValueSelected ||
      !this.constraintOperatorSelected ||
      !this.constraintThresholdValue
    ) {
      return;
    }

    this.constraint = this.constraintGenerator.createConstraint(
      this.constraintProjectSelected,
      this.constraintFunctionPropertySelected,
      this.constraintFunctionOperatorSelected,
      this.constraintFunctionValueSelected,
      this.constraintOperatorSelected,
      this.constraintThresholdValue
    );
  }

  storeConstraint(): void {
    if (this.constraint) {
      this.constraintsService.addConstraint(this.constraint);
      // this.overlayService.closeOverlay();
      this.overlayService.closeOverlay();
    }
  }
}
