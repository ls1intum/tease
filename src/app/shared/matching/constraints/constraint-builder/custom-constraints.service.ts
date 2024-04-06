import { Injectable } from '@angular/core';
import { IdMappingService } from '../../../data/id-mapping.service';
import { Project, Student } from 'src/app/api/models';
import { StudentIdToProjectIdMapping } from '../../../data/locks.service';
import { ConstraintWrapper } from '../constraint';
import { Operator } from '../constraint-utils';

@Injectable({
  providedIn: 'root',
})
export class CustomConstraintsService {
  constructor(private constraintMappingService: IdMappingService) {}

  createConstraints(constraintWrappers: ConstraintWrapper[]): string[] {
    return constraintWrappers.flatMap(constraintWrapper =>
      this.createConstraintForConstraintWrapper(constraintWrapper)
    );
  }

  private createConstraintForConstraintWrapper(constraintWrapper: ConstraintWrapper): string[] {
    const projectIds = constraintWrapper.projectIds;
    const constraints: string[] = [];
    const students = constraintWrapper.constraintFunction.students;
    const lowerBound = constraintWrapper.threshold.lowerBound;
    const upperBound = constraintWrapper.threshold.upperBound;

    projectIds.forEach(projectId => {
      constraints.push(
        this.createConstraintForProjectIdAndBound(projectId, students, Operator.GREATER_THAN_OR_EQUAL, lowerBound)
      );
      constraints.push(
        this.createConstraintForProjectIdAndBound(projectId, students, Operator.LESS_THAN_OR_EQUAL, upperBound)
      );
    });

    return constraints;
  }

  private createConstraintForProjectIdAndBound(
    projectId: string,
    students: Student[],
    operator: Operator,
    threshold: number
  ): string {
    const constraintMappingService = this.constraintMappingService;
    const studentProjectPairs = students.map(student => {
      const studentId = constraintMappingService.getNumericalId(student.id);
      const projectIdNumber = constraintMappingService.getNumericalId(projectId);
      return `x${studentId}y${projectIdNumber}`;
    });
    return `${studentProjectPairs.join(' + ')} ${operator} ${threshold}`;
  }
}
