import { ConstraintFunction, SelectData, PropertySelectGroup } from './constraint-functions/constraint-function';
import { SkillConstraintFunction } from './constraint-functions/skill-constraint-function';
import { GenderConstraintFunction } from './constraint-functions/gender-connstraint-function';
import { Project, Skill, Student } from 'src/app/api/models';
import { DeviceConstraintFunction } from './constraint-functions/device-constraint-function';
import { Operator, OperatorMapping } from './constraint-utils';
import { ConstraintWrapper } from './constraint';
import { ConstraintMappingService } from '../../data/constraint-mapping.service';
import { Injectable } from '@angular/core';
import { StudentsService } from '../../data/students.service';
import { ProjectsService } from '../../data/projects.service';
import { SkillsService } from '../../data/skills.service';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ConstraintBuilder {
  private readonly CONSTRAINT_OPERATORS = [Operator.GREATER_THAN_OR_EQUAL, Operator.LESS_THAN_OR_EQUAL];
  private _students: Student[];
  private _projects: Project[];
  private _projectIds: string[];
  private _skills: Skill[];
  private _constraintFunctions: ConstraintFunction[] = [];
  private _constraintFunctionProperties: PropertySelectGroup[] = [];
  private _constraintOperators: SelectData[];
  private _constraintProjects: SelectData[];

  constructor(
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private constraintMappingService: ConstraintMappingService
  ) {
    this.studentsService.students$.subscribe(students => {
      this._students = students;
      this.updateConstraintFunctions();
    });

    this.projectsService.projects$.subscribe(projects => {
      this._projects = projects;
      this.updateConstraintFunctions();
    });

    this.skillsService.skills$.subscribe(skills => {
      this._skills = skills;
      this.updateConstraintFunctions();
    });
  }

  private updateConstraintFunctions(): void {
    if (this._students && this._projects && this._skills) {
      this._constraintFunctions = [
        new GenderConstraintFunction(this._students, this._skills),
        new SkillConstraintFunction(this._students, this._skills),
        new DeviceConstraintFunction(this._students, this._skills),
      ];

      this._projectIds = this._projects.map(project => project.id);

      this._constraintFunctionProperties = this._constraintFunctions.map(constraintFunction =>
        constraintFunction.getProperties()
      );

      this._constraintOperators = this.getConstraintOperators();
      this._constraintProjects = this.getConstraintProjects();
    }
  }

  get constraintFunctionProperties(): PropertySelectGroup[] {
    return this._constraintFunctionProperties;
  }

  get constraintOperators(): SelectData[] {
    return this._constraintOperators;
  }

  get constraintProjects(): SelectData[] {
    return this._constraintProjects;
  }

  getConstraintFunctionOperators(id: string): SelectData[] {
    return this.findConstraintFunction(id).getOperators();
  }

  getConstraintFunctionValues(id: string): SelectData[] {
    return this.findConstraintFunction(id).getValues();
  }

  createConstraint(
    projectId: string,
    id: string,
    constraintFunctionOperator: string,
    constraintFunctionValue: string,
    constraintOperator: string,
    constraintThreshold: number
  ): ConstraintWrapper {
    const constraintFunction = this.findConstraintFunction(id);
    const filteredStudents = constraintFunction.filterStudentsByConstraintFunction(
      id,
      constraintFunctionOperator as Operator,
      constraintFunctionValue
    );

    const projectIds = this._projectIds.includes(projectId) ? [projectId] : this._projectIds;
    const constraint = projectIds.map(projectId => {
      return this.buildConstraint(filteredStudents, projectId, constraintOperator, constraintThreshold);
    });
    console.log('projectIds', projectIds);

    return new ConstraintWrapper(
      constraint,
      filteredStudents,
      projectIds,
      this.getConstraintFunctionProperty(id),
      constraintFunctionOperator,
      constraintFunctionValue,
      constraintOperator,
      constraintThreshold
    );
  }

  private buildConstraint(
    students: Student[],
    projectId: string,
    constraintOperator: string,
    constraintThreshold: number
  ): string {
    const constraintMappingService = this.constraintMappingService;

    const studentProjectPairs = students.map(student => {
      const studentId = constraintMappingService.getNumber(student.id);
      const projectIdNumber = constraintMappingService.getNumber(projectId);
      return `x${studentId}y${projectIdNumber}`;
    });

    return `${studentProjectPairs.join(' + ')} ${constraintOperator} ${constraintThreshold}`;
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

  private getConstraintFunctionProperty(id: string): string {
    for (const constraintFunctionProperty of this.constraintFunctionProperties) {
      const value = constraintFunctionProperty.values.find(value => value.id === id);
      if (value) return value.name;
    }
    throw new Error(`Property for id "${id}" not found`);
  }

  private getConstraintProjects(): SelectData[] {
    return [
      {
        name: 'All Projects',
        id: uuid(),
      },
      ...this._projects.map(project => ({
        name: project.name,
        id: project.id,
      })),
    ];
  }

  private getConstraintOperators(): SelectData[] {
    return this.CONSTRAINT_OPERATORS.map(operator => ({
      id: operator,
      name: OperatorMapping[operator],
    }));
  }
}
