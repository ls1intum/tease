import { Injectable } from '@angular/core';
import { Student } from 'src/app/api/models';
import { IdMappingService } from '../../../data/id-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class CostFunctionsService {
  constructor(private constraintMappingService: IdMappingService) {}

  createCostFunction(students: Student[]): string {
    const coreCostFunction = students
      .flatMap(student => {
        const studentNumericalId = this.constraintMappingService.getNumericalId(student.id);
        const length = student.projectPreferences.length;
        return student.projectPreferences.map(projectPreference => {
          const projectNumericalId = this.constraintMappingService.getNumericalId(projectPreference.projectId);
          const cost = length - projectPreference.priority;
          return `${cost} x${studentNumericalId}y${projectNumericalId}`;
        });
      })
      .join(' + ');

    return `max: ${coreCostFunction}`;
  }
}
