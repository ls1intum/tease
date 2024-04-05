import { ConstraintFunction, SelectData, PropertySelectGroup } from './constraint-functions/constraint-function';
import { SkillConstraintFunction } from './constraint-functions/skill-constraint-function';
import { GenderConstraintFunction } from './constraint-functions/gender-connstraint-function';
import { Project, Skill, Student } from 'src/app/api/models';
import { DeviceConstraintFunction } from './constraint-functions/device-constraint-function';
import { Operator, OperatorMapping } from './constraint-utils';
import { ConstraintWrapper } from './constraint';
import { IdMappingService } from '../../data/id-mapping.service';
import { Injectable } from '@angular/core';
import { TeamSizeConstraintFunction } from './constraint-functions/team-size-constraint-function';
import { IntroCourseProficiencyConstraintFunction } from './constraint-functions/intro-course-proficiency-constraint-function';
import { LanguageProficiencyConstraintFunction } from './constraint-functions/language-proficiency-constraint-function';
import { NationalityConstraintFunction } from './constraint-functions/nationality-constraint-function';

@Injectable({
  providedIn: 'root',
})
export class ConstraintBuilderService {
  private readonly CONSTRAINT_OPERATORS = [Operator.GREATER_THAN_OR_EQUAL, Operator.LESS_THAN_OR_EQUAL];

  constructor(private constraintMappingService: IdMappingService) {}

  getConstraintFunctions(students: Student[], skills: Skill[]): ConstraintFunction[] {
    return [
      new GenderConstraintFunction(students, skills),
      new SkillConstraintFunction(students, skills),
      new DeviceConstraintFunction(students, skills),
      new TeamSizeConstraintFunction(students, skills),
      new IntroCourseProficiencyConstraintFunction(students, skills),
      new LanguageProficiencyConstraintFunction(students, skills),
      new NationalityConstraintFunction(students, skills),
    ];
  }

  createConstraint(
    constraintFunctions: ConstraintFunction[],
    projects: Project[],
    projectId: string,
    id: string,
    constraintFunctionOperator: string,
    constraintFunctionValue: string,
    constraintOperator: string,
    constraintThreshold: number
  ): ConstraintWrapper {
    const constraintFunction = this.findConstraintFunction(constraintFunctions, id);
    const filteredStudents = constraintFunction.filterStudentsByConstraintFunction(
      id,
      constraintFunctionOperator as Operator,
      constraintFunctionValue
    );
    const allProjectIds = projects.map(project => project.id);
    const projectIds = allProjectIds.includes(projectId) ? [projectId] : allProjectIds;
    const constraint = projectIds.map(projectId => {
      return this.buildConstraint(filteredStudents, projectId, constraintOperator, constraintThreshold);
    });

    return null;
    // return new ConstraintWrapper(
    //   constraint,
    //   filteredStudents,
    //   projectIds,
    //   this.findConstraintFunctionProperty(constraintFunction, id),
    //   constraintFunctionOperator,
    //   constraintFunctionValue,
    //   constraintOperator,
    //   constraintThreshold
    // );
  }

  private buildConstraint(
    students: Student[],
    projectId: string,
    constraintOperator: string,
    constraintThreshold: number
  ): string {
    const constraintMappingService = this.constraintMappingService;
    const studentProjectPairs = students.map(student => {
      const studentId = constraintMappingService.getNumericalId(student.id);
      const projectIdNumber = constraintMappingService.getNumericalId(projectId);
      return `x${studentId}y${projectIdNumber}`;
    });
    return `${studentProjectPairs.join(' + ')} ${constraintOperator} ${constraintThreshold}`;
  }

  private findConstraintFunction(constraintFunctions: ConstraintFunction[], id: string): ConstraintFunction {
    for (const constraintFunction of constraintFunctions) {
      const value = constraintFunction.getProperties().values.find(value => value.id === id);
      if (value) {
        return constraintFunction;
      }
    }
    throw new Error(`Constraint function for id "${id}" not found`);
  }

  private findConstraintFunctionProperty(constraintFunction: ConstraintFunction, id: string): string {
    const value = constraintFunction.getProperties().values.find(value => value.id === id);
    if (value) return value.name;
    throw new Error(`Property for id "${id}" not found`);
  }

  getConstraintOperators(): SelectData[] {
    return this.CONSTRAINT_OPERATORS.map(operator => ({
      id: operator,
      name: OperatorMapping[operator],
    }));
  }

  getConstraintProjects(projects: Project[]): SelectData[] {
    return [
      {
        name: 'All Projects',
        id: 'all-projects',
      },
      ...projects.map(project => ({
        name: project.name,
        id: project.id,
      })),
    ];
  }

  getConstraintFunctionProperties(constraintFunctions: ConstraintFunction[]): PropertySelectGroup[] {
    return constraintFunctions.map(constraintFunction => constraintFunction.getProperties());
  }

  getConstraintFunctionValues(constraintFunctions: ConstraintFunction[], id: string): SelectData[] {
    return this.findConstraintFunction(constraintFunctions, id).getValues();
  }

  getConstraintFunctionOperators(constraintFunctions: ConstraintFunction[], id: string): SelectData[] {
    return this.findConstraintFunction(constraintFunctions, id).getOperators();
  }
}
