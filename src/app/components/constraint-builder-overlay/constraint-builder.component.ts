import { Component, OnDestroy, OnInit } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import {
  ConstraintFunction,
  PropertySelectGroup,
  SelectData,
} from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ConstraintBuilderService } from 'src/app/shared/matching/constraints/constraint-builder';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { Project, Skill, Student } from 'src/app/api/models';
import { Subscription } from 'rxjs';
import { Operator } from 'src/app/shared/matching/constraints/constraint-utils';

@Component({
  selector: 'app-constraint-builder',
  templateUrl: './constraint-builder.component.html',
  styleUrl: './constraint-builder.component.scss',
})
export class ConstraintBuilderComponent implements OverlayComponent, OnInit, OnDestroy {
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

  private students: Student[];
  private skills: Skill[];
  private projects: Project[];
  private subscriptions: Subscription[] = [];

  private constraintFunctions: ConstraintFunction[];
  private readonly CONSTRAINT_OPERATORS = [Operator.GREATER_THAN_OR_EQUAL, Operator.LESS_THAN_OR_EQUAL];

  constructor(
    private constraintsService: ConstraintsService,
    private overlayService: OverlayService,
    private constraintBuilderService: ConstraintBuilderService,
    private studentsService: StudentsService,
    private skillsService: SkillsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.studentsService.students$.subscribe(students => {
        this.students = students;
        this.updateData();
      }),
      this.skillsService.skills$.subscribe(skills => {
        this.skills = skills;
        this.updateData();
      }),
      this.projectsService.projects$.subscribe(projects => {
        this.projects = projects;
        this.updateData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe());
  }

  private updateData(): void {
    if (!this.students || !this.skills || !this.projects) return;
    this.constraintFunctions = this.constraintBuilderService.getConstraintFunctions(this.students, this.skills);
    this.constraintFunctionProperties = this.constraintBuilderService.getConstraintFunctionProperties(
      this.constraintFunctions
    );
    this.constraintProjectSelectData = this.constraintBuilderService.getConstraintProjects(this.projects);
    this.selectedConstraintProject = this.constraintProjectSelectData[0].id;
    this.constraintOperators = this.constraintBuilderService.getConstraintOperators();
    this.selectedConstraintOperator = this.constraintOperators[0].id;
  }

  selectData(): void {
    this.getConstraintFunctionValues();
    this.getConstraintFunctionOperators();
    this.getConstraint();
  }

  private getConstraintFunctionValues(): void {
    this.constraintFunctionValueSelectData = this.constraintBuilderService.getConstraintFunctionValues(
      this.constraintFunctions,
      this.selectedConstraintFunctionProperty
    );

    this.selectedConstraintFunctionValue = !this.constraintFunctionValueSelectData?.length
      ? this.constraintFunctionValueSelectData[0].id
      : null;
  }

  private getConstraintFunctionOperators(): void {
    this.constraintFunctionOperatorSelectData = this.constraintBuilderService.getConstraintFunctionOperators(
      this.constraintFunctions,
      this.selectedConstraintFunctionProperty
    );

    this.selectedConstraintFunctionOperator = !this.constraintFunctionOperatorSelectData?.length
      ? this.constraintFunctionOperatorSelectData[0].id
      : null;
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

    this.constraint = this.constraintBuilderService.createConstraint(
      this.constraintFunctions,
      this.projects,
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

  private findConstraintFunction(id: string): ConstraintFunction {
    for (const constraintFunctionProperty of this.constraintFunctionProperties) {
      const value = constraintFunctionProperty.values.find(value => value.id === id);
      if (value) {
        return constraintFunctionProperty.constraintFunction;
      }
    }
    throw new Error(`Property for id "${id}" not found`);
  }
}
