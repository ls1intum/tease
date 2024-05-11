import { Component, OnInit, ViewChild } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import {
  ConstraintFunction,
  SelectData,
} from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';
import { NationalityConstraintFunction } from 'src/app/shared/matching/constraints/constraint-functions/nationality-constraint-function';
import { ConstraintSummaryViewComponent } from '../constraint-summary-view/constraint-summary-view.component';
import { SelectDataService } from 'src/app/shared/services/select-data.service';
import { Operator } from 'src/app/shared/matching/constraints/constraint-utils';
import {
  ConstraintFunctionWrapper,
  ConstraintWrapper,
  ThresholdWrapper,
} from 'src/app/shared/matching/constraints/constraint';
import { v4 as uuid } from 'uuid';
import { facMoreIcon } from 'src/assets/icons/icons';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-constraint-builder-nationality',
  templateUrl: './constraint-builder-nationality.component.html',
  styleUrl: './constraint-builder-nationality.component.scss',
})
export class ConstraintBuilderNationalityComponent implements OverlayComponent, OnInit {
  facMoreIcon = facMoreIcon;

  data: {};
  projectsSelectData: SelectData[] = [];
  selectedProjectIds: string[] = [];
  nationalitiesSelectData: SelectData[] = [];
  selectedNationalityIds: string[] = [];

  constraintFunction: NationalityConstraintFunction;

  isFormValid = false;

  // "Staatenliste im Sinne von § 13 Abs. 1 Nr. 17 SÜG" accessed on 30.04.2024
  readonly STAATENLISTE = [
    'AF',
    'DZ',
    'AM',
    'AZ',
    'BY',
    'CN',
    'GE',
    'IQ',
    'IR',
    'KZ',
    'KG',
    'KP',
    'CU',
    'LA',
    'LB',
    'LY',
    'MD',
    'PK',
    'RU',
    'SD',
    'SY',
    'TJ',
    'TM',
    'UA',
    'UZ',
    'VN',
  ];

  @ViewChild('nationalitySelect') nationalitySelect: SelectComponent;

  constructor(
    private constraintsService: ConstraintsService,
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private overlayService: OverlayService,
    private selectDataService: SelectDataService
  ) {}

  ngOnInit(): void {
    const students = this.studentsService.getStudents();
    this.constraintFunction = new NationalityConstraintFunction(students, []);
    this.nationalitiesSelectData = this.constraintFunction.getValues();
    this.projectsSelectData = this.projectsService.getProjects().map(project => ({
      id: project.id,
      name: project.name,
    }));
  }
  close(): void {
    this.overlayService.closeOverlay();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintSummaryViewComponent, {});
    }, 10);
  }

  save(): void {
    const thresholdWrapper = this.getThresholdWrapper();

    this.nationalitiesSelectData.forEach(nationality => {
      if (!nationality.selected) {
        return;
      }
      const constraintFunctionWrapper = this.getConstraintFunctionWrapper(nationality);
      const constraint: ConstraintWrapper = {
        projectIds: this.selectedProjectIds,
        constraintFunction: constraintFunctionWrapper,
        threshold: thresholdWrapper,
        id: uuid(),
        active: true,
      };
      this.constraintsService.addConstraint(constraint);
    });

    this.close();
  }

  private getConstraintFunctionWrapper(nationality: SelectData): ConstraintFunctionWrapper {
    const property = this.constraintFunction.getProperties().values[0];
    const operator = Operator.EQUALS;
    const filteredStudents = this.constraintFunction.filterStudentsByConstraintFunction(
      null,
      Operator.EQUALS,
      nationality.id
    );

    return {
      property: property.name,
      propertyId: property.id,
      operator: operator,
      value: nationality.name,
      valueId: nationality.id,
      students: filteredStudents,
    };
  }

  private getThresholdWrapper(): ThresholdWrapper {
    return {
      lowerBound: 0,
      upperBound: 0,
    };
  }

  selectFromStaatenliste(): void {
    this.selectedNationalityIds = [];
    this.nationalitiesSelectData.forEach(nationality => {
      if (this.STAATENLISTE.includes(nationality.id)) {
        this.selectedNationalityIds.push(nationality.id);
        nationality.selected = true;
        return;
      }
      nationality.selected = false;
    });
    this.nationalitySelect.updateAllSelected();
    this.updateFormValid();
  }

  projectsSelectionChange(projectIds: string[]): void {
    this.selectedProjectIds = projectIds;
    this.updateFormValid();
  }

  nationalitiesSelectionChange(nationalityIds: string[]): void {
    this.selectedNationalityIds = nationalityIds;
    this.updateFormValid();
  }

  updateFormValid(): void {
    if (this.selectedProjectIds.length && this.selectedNationalityIds.length) {
      this.isFormValid = true;
      return;
    }
    this.isFormValid = false;
  }
}
