import { Injectable } from '@angular/core';
import { Project, Student } from 'src/app/api/models';
import { StudentsService } from '../../data/students.service';
import { ProjectsService } from '../../data/projects.service';
import { ConstraintMappingService } from '../../data/constraint-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class CostFunctionsService {
  private _students: Student[];
  private _constraints: string[];

  constructor(
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private constraintMappingService: ConstraintMappingService
  ) {
    this.studentsService.students$.subscribe(students => {
      this._students = students;
      this.updateConstraints();
    });
  }

  get constraints(): string[] {
    console.log(this._constraints);
    return this._constraints;
  }

  private updateConstraints() {
    if (!this._students) return;
    this._constraints = [this.createCostFunction()];
  }

  private createCostFunction(): string {
    const coreCostFunction = this._students
      .flatMap(student => {
        const studentNumber = this.constraintMappingService.getNumber(student.id);
        const length = student.projectPreferences.length;
        return student.projectPreferences.map(projectPreference => {
          const projectNumber = this.constraintMappingService.getNumber(projectPreference.projectId);
          const cost = length - projectPreference.priority;
          return `${cost} x${studentNumber}y${projectNumber}`;
        });
      })
      .join(' + ');

    return `max: ${coreCostFunction}`;
  }
}
