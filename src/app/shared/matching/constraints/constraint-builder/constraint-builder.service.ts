import { Injectable } from '@angular/core';
import { Student } from 'src/app/api/models';
import { IdMappingService } from '../../../data/id-mapping.service';
import { ConstraintWrapper } from '../constraint';
import { MandatoryConstraintsService } from './mandatory-contraints.service';
import { CustomConstraintsService } from './custom-constraints.service';
import { CostFunctionsService } from './cost-functions.service';
import { LockedConstraintsService } from './locked-constraints.service';
import { StudentIdToProjectIdMapping } from 'src/app/shared/data/locks.service';

@Injectable({
  providedIn: 'root',
})
export class ConstraintBuilderService {
  constructor(
    private mandatoryConstraintsServce: MandatoryConstraintsService,
    private customConstraintsService: CustomConstraintsService,
    private costFunctionsService: CostFunctionsService,
    private lockedConstraintsService: LockedConstraintsService
  ) {}

  createConstraints(
    students: Student[],
    projectIds: string[],
    constraintWrappers: ConstraintWrapper[],
    locks: StudentIdToProjectIdMapping
  ): string[] {
    var constraints: string[] = this.mandatoryConstraintsServce.createConstraints(students, projectIds);
    constraints.push(...this.customConstraintsService.createConstraints(constraintWrappers));
    constraints.push(this.costFunctionsService.createCostFunction(students));
    constraints.push(...this.lockedConstraintsService.createConstraints(locks));

    return constraints;
  }
}
