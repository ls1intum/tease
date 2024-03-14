import { Injectable } from '@angular/core';
import { StudentsService } from '../../data/students.service';
import { ProjectsService } from '../../data/projects.service';
import { ConstraintMappingService } from '../../data/constraint-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class MandatoryConstraintsService {
  private _projectNumbers: string[];
  private _studentNumbers: string[];
  private _constraints: string[];

  constructor(
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private constraintMappingService: ConstraintMappingService
  ) {
    this.studentsService.students$.subscribe(students => {
      this._studentNumbers = students.map(student => this.constraintMappingService.getNumber(student.id));
      this.updateConstraints();
    });

    this.projectsService.projects$.subscribe(projects => {
      this._projectNumbers = projects.map(project => this.constraintMappingService.getNumber(project.id));
      this.updateConstraints();
    });
  }

  get constraints(): string[] {
    console.log(this._constraints);
    return this._constraints;
  }

  private updateConstraints() {
    if (!this._projectNumbers || !this._studentNumbers) return;
    this._constraints = this.createIntegerConstraints();
    this._constraints.push(...this.createOneStudentConstraint());
  }

  private createIntegerConstraints(): string[] {
    return this._studentNumbers.flatMap(studentNumber => {
      return this._projectNumbers.map(projectNumber => {
        return `int x${studentNumber}y${projectNumber}`;
      });
    });
  }

  private createOneStudentConstraint(): string[] {
    return this._studentNumbers.map(studentNumber => {
      return (
        this._projectNumbers
          .map(projectNumber => {
            return `x${studentNumber}y${projectNumber}`;
          })
          .join(' + ') + ' = 1'
      );
    });
  }
}
