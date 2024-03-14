import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentsService } from 'src/app/shared/data/students.service';
import { Allocation, Project, Student } from 'src/app/api/models';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { Subscription } from 'rxjs';
import { OverlayService } from 'src/app/overlay.service';
import { PersonDetailOverlayComponent } from '../person-detail-overlay/person-detail-overlay.component';
import { TeamService } from 'src/app/shared/layers/business-logic-layer/team.service';
import { DragulaService } from 'ng2-dragula';
import { facCheckIcon, facErrorIcon } from 'src/assets/icons/icons';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { Comparator } from 'src/app/shared/matching/constraints/constraint-utils';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  facErrorIcon = facErrorIcon;
  facCheckIcon = facCheckIcon;

  private _students: Student[];
  private _projects: Project[];
  private _allocations: Allocation[];
  private _constraints: ConstraintWrapper[];

  allocationsData: AllocationData[];
  emptyStudent: Student;

  constructor(
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private allocationsService: AllocationsService,
    private constraintsService: ConstraintsService
  ) {}

  ngOnInit(): void {
    this.studentsService.students$.subscribe(students => {
      this._students = students;
      this.updateAllocationsData();
    });
    this.projectsService.projects$.subscribe(projects => {
      this._projects = projects;
      this.updateAllocationsData();
    });
    this.allocationsService.allocations$.subscribe(allocations => {
      this._allocations = allocations;
      this.updateAllocationsData();
    });
    this.constraintsService.constraints$.subscribe(constraints => {
      this._constraints = constraints;
      this.updateAllocationsData();
    });
  }

  private updateAllocationsData() {
    if (!this._allocations || !this._projects || !this._students || !this._constraints) return;
    this.emptyStudent = this._students[0];
    const constraints = this.constraintsService.getConstraints();

    const allocationsData = this._projects.map(project => {
      const allocation = this._allocations.find(allocation => project.id === allocation.projectId);
      let students = [];
      if (allocation) {
        students = allocation.students.map(studentId => this._students.find(student => student.id === studentId));
      }
      const errorData = this.getErrorData(project.id, students);

      return { project: project, error: errorData, students: students };
    });

    this.allocationsData = allocationsData;
  }

  private getErrorData(projectId: string, students: Student[]): ErrorData {
    let error = false;
    let info = '';
    for (const constraint of this._constraints) {
      if (!constraint.projectIds.includes(projectId)) continue;

      const studentsPassing = students.filter(student =>
        constraint.students.map(student => student.id).includes(student.id)
      );
      const passesConstraint = Comparator[constraint.constraintOperator](
        studentsPassing.length,
        constraint.constraintThreshold
      );
      if (!passesConstraint) {
        error = true;
        info += `${constraint.constraintFunctionProperty} ${constraint.constraintOperator} ${constraint.constraintThreshold} has ${studentsPassing.length};\n`;
      }
    }
    return { error: error, info: info };
  }
}

interface AllocationData {
  project: Project;
  error: ErrorData;
  students: Student[];
}

interface ErrorData {
  error: boolean;
  info: string;
}
