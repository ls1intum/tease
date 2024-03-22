import { Injectable } from '@angular/core';
import { IdMappingService } from '../../data/id-mapping.service';
import { Project, Student } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class MandatoryConstraintsService {
  constructor(private constraintMappingService: IdMappingService) {}

  createMandatoryConstraints(students: Student[], projects: Project[]): string[] {
    const studentNumericalIds = students.map(student => this.constraintMappingService.getNumericalId(student.id));
    const projectNumericalIds = projects.map(project => this.constraintMappingService.getNumericalId(project.id));

    const constraints = this.createIntegerConstraints(studentNumericalIds, projectNumericalIds);
    constraints.push(...this.createOneStudentConstraint(studentNumericalIds, projectNumericalIds));

    return constraints;
  }

  private createIntegerConstraints(studentNumericalIds: string[], projectNumericalIds: string[]): string[] {
    return studentNumericalIds.flatMap(studentNumericalId => {
      return projectNumericalIds.map(projectNumericalId => {
        return `int x${studentNumericalId}y${projectNumericalId}`;
      });
    });
  }

  private createOneStudentConstraint(studentNumericalIds: string[], projectNumericalIds: string[]): string[] {
    return studentNumericalIds.map(studentNumericalId => {
      return (
        projectNumericalIds
          .map(projectNumericalId => {
            return `x${studentNumericalId}y${projectNumericalId}`;
          })
          .join(' + ') + ' = 1'
      );
    });
  }
}
