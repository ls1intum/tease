import { Component, OnInit } from '@angular/core';
import { OverlayComponent } from 'src/app/overlay.service';

import {
  SelectData,
  SelectGroup,
} from 'src/app/shared/matching/constraints-2/constraint-functions/constraint-function';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ConstraintFunctionGenerator } from 'src/app/shared/matching/constraints-2/constraint-function-generator';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { valueSeparator } from 'src/app/shared/matching/constraints-2/constraint-utils';

@Component({
  selector: 'app-constraints-overlay-2',
  templateUrl: './constraints-overlay-2.component.html',
  styleUrl: './constraints-overlay-2.component.css',
})
export class ConstraintsOverlay2Component implements OverlayComponent, OnInit {
  // change OverlayComponent in future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;

  constructor(
    private studentsService: StudentsService,
    private skillsService: SkillsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.constraintFunctionGenerator = new ConstraintFunctionGenerator(
      this.studentsService.getStudents(),
      this.skillsService.getSkills()
    );
    this.constraintFunctionPropertySelectGroups = this.constraintFunctionGenerator.getConstraintFunctionProperties();

    const projects = this.projectsService.getProjects();
    this.constraintProjectSelectData = projects.map(project => ({
      name: project.name,
      value: project.id,
    }));
    const allProjectsValue = projects.map(project => project.id).join(valueSeparator);
    this.constraintProjectSelectData.unshift({
      name: 'All Projects',
      value: allProjectsValue,
    });
    this.constraintProjectSelected = allProjectsValue;

    this.constraintOperatorSelectData = this.constraintFunctionGenerator.getConstraintOperators();
    this.constraintOperatorSelected = this.constraintOperatorSelectData[0].value;
  }

  constraintFunctionGenerator: ConstraintFunctionGenerator;

  constraintFunctionPropertySelectGroups: SelectGroup[];
  constraintFunctionOperatorSelectData: SelectData[];
  constraintFunctionValueSelectData: SelectData[];
  constraintProjectSelectData: SelectData[];
  constraintOperatorSelectData: SelectData[];

  constraintFunctionPropertySelected: string;
  constraintFunctionOperatorSelected: string;
  constraintFunctionValueSelected: string;
  constraintProjectSelected: string;
  constraintOperatorSelected: string;
  constraintThresholdValue: number;

  selectData(): void {
    this.getConstraintFunctionValues();
    this.getConstraintFunctionOperators();
    this.getConstraintFunction();
  }

  private getConstraintFunctionValues(): void {
    this.constraintFunctionValueSelectData = this.constraintFunctionGenerator.getConstraintFunctionValues(
      this.constraintFunctionPropertySelected
    );

    if (this.constraintFunctionValueSelectData || this.constraintFunctionValueSelectData.length < 1) {
      this.constraintFunctionValueSelected = null;
    }
    this.constraintFunctionValueSelected = this.constraintFunctionValueSelectData[0].value;
  }

  private getConstraintFunctionOperators(): void {
    this.constraintFunctionOperatorSelectData = this.constraintFunctionGenerator.getConstraintFunctionOperators(
      this.constraintFunctionPropertySelected
    );

    if (this.constraintFunctionOperatorSelectData || this.constraintFunctionOperatorSelectData.length < 1) {
      this.constraintFunctionOperatorSelected = null;
    }
    this.constraintFunctionOperatorSelected = this.constraintFunctionOperatorSelectData[0].value;
  }

  constraintFunctions: string[];

  getConstraintFunction(): void {
    this.constraintFunctions = [];
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

    this.constraintFunctions = this.constraintFunctionGenerator.getConstraint(
      this.constraintProjectSelected.split(valueSeparator),
      this.constraintFunctionPropertySelected,
      this.constraintFunctionOperatorSelected,
      this.constraintFunctionValueSelected,
      this.constraintOperatorSelected,
      this.constraintThresholdValue
    );
  }
}
