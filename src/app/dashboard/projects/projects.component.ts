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

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  constructor(
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private allocationsService: AllocationsService,
    private dragularService: DragulaService
  ) {}

  ngOnInit(): void {
    this.studentsService.students$.subscribe(students => {
      this._students = students;
      this.updateAllocationsData();
    }),
      this.projectsService.projects$.subscribe(projects => {
        this._projects = projects;
        this.updateAllocationsData();
      }),
      this.allocationsService.allocations$.subscribe(allocations => {
        this._allocations = allocations;
        this.updateAllocationsData();
      });
  }

  private _students: Student[];
  private _projects: Project[];
  private _allocations: Allocation[];
  allocationsData: AllocationData[];
  emptyStudent: Student;

  private updateAllocationsData() {
    if (!this._allocations || !this._projects || !this._students) return;
    this.emptyStudent = this._students[0];

    const allocationsData = this._allocations.map(allocation => {
      const project = this._projects.find(project => project.id == allocation.projectId);
      const students = allocation.students.map(studentId => this._students.find(student => student.id === studentId));
      return { project: project, students: students };
    });

    this.allocationsData = allocationsData;
  }
}

interface AllocationData {
  project: Project;
  students: Student[];
}
