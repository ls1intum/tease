import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { OverlayHostDirective } from './overlay-host.directive';
import { OverlayComponent, OverlayService, OverlayServiceHost } from './overlay.service';
import { DragulaService } from 'ng2-dragula';
import { Allocation, Project, Skill, Student } from 'src/app/api/models';
import { StudentsService } from 'src/app/shared/data/students.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { Subscription } from 'rxjs';
import { Comparator, Operator } from './shared/matching/constraints/constraint-utils';
import { ConstraintWrapper } from './shared/matching/constraints/constraint';
import { AllocationData, ProjectData, ProjectError } from './shared/models/allocation-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None, // This is needed to get the material icons to work. Angular bug?
})
export class AppComponent implements OverlayServiceHost, OnInit, OnDestroy {
  overlayVisible = false;
  dataLoaded = false;
  allocationData: AllocationData;

  @ViewChild(OverlayHostDirective)
  private overlayHostDirective: OverlayHostDirective;

  private subscriptions: Subscription[] = [];
  private students: Student[];
  private projects: Project[];
  private skills: Skill[];
  private allocations: Allocation[];
  private constraints: ConstraintWrapper[];

  constructor(
    public overlayService: OverlayService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dragulaService: DragulaService,
    private studentsService: StudentsService,
    private allocationsService: AllocationsService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private constraintsService: ConstraintsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.overlayService.host = this;
  }

  ngOnInit(): void {
    this.dragulaService.createGroup('STUDENTS', {
      invalid: el => {
        return el.classList.contains('locked');
      },
    });

    this.subscriptions.push(
      this.dragulaService.drop('STUDENTS').subscribe(({ el, target, sibling }) => {
        this.handleStudentDrop(el, target, sibling);
      }),
      this.allocationsService.allocations$.subscribe(allocations => {
        this.allocations = allocations;
        this.updateData();
      }),
      this.studentsService.students$.subscribe(students => {
        this.students = students;
        this.updateData();
      }),
      this.projectsService.projects$.subscribe(projects => {
        this.projects = projects;
        this.updateData();
      }),
      this.skillsService.skills$.subscribe(skills => {
        this.skills = skills;
        this.updateData();
      }),
      this.constraintsService.constraints$.subscribe(constraints => {
        this.constraints = constraints;
        this.updateData();
      })
    );
  }

  private updateDataLoaded(): void {
    this.dataLoaded = !!(
      this.students?.length &&
      this.projects?.length &&
      this.skills?.length &&
      this.allocations &&
      this.constraints
    );
  }

  private updateData(): void {
    this.updateDataLoaded();
    if (!this.dataLoaded) return;
    this.updateAllocation();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe());
  }

  private handleStudentDrop(el: Element, target: Element, sibling: Element): void {
    if (!el || !target) return;
    const studentId = el.children[0].id;
    const projectId = target.id;
    const siblingId = sibling?.children[0].id;

    if (!studentId) return;

    if (!projectId) {
      this.allocationsService.removeStudentFromProjects(studentId);
      return;
    }

    this.allocationsService.moveStudentToProjectAtPosition(studentId, projectId, siblingId);
  }

  /* OverlayServiceHost interface */
  public displayComponent(component: Type<OverlayComponent>, data: any) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.overlayHostDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as OverlayComponent).data = data;
    this.overlayVisible = true;
  }

  public closeOverlay() {
    this.overlayVisible = false;
    this.overlayHostDirective.viewContainerRef.clear();
  }

  private updateAllocation() {
    this.allocationData = {
      projectsData: this.updateProjectsData(),
      studentsWithoutTeam: this.updateStudentsWithoutTeam(),
    };
  }

  private updateProjectsData(): ProjectData[] {
    return this.projects.map(project => {
      const allocation = this.allocations.find(allocation => project.id === allocation.projectId);
      let students = [];
      if (allocation) {
        students = allocation.students.map(studentId => this.students.find(student => student.id === studentId));
      }
      const errorData = this.getErrorData(project.id, students);

      return { project: project, error: errorData, students: students };
    });
  }

  private updateStudentsWithoutTeam(): Student[] {
    return this.students.filter(
      student => !this.allocations.some(allocation => allocation.students.includes(student.id))
    );
  }

  private getErrorData(projectId: string, students: Student[]): ProjectError {
    let error = false;
    let info = '';
    for (const constraint of this.constraints) {
      if (!constraint.projectIds.includes(projectId)) continue;

      const studentIdsInConstraint = constraint.constraintFunction.students.map(
        studentInConstraint => studentInConstraint.id
      );
      const studentsPassing = students.filter(student => studentIdsInConstraint.includes(student.id));

      const passesLowerBound = Comparator[Operator.GREATER_THAN_OR_EQUAL](
        studentsPassing.length,
        constraint.threshold.lowerBound
      );

      const passesUpperBound = Comparator[Operator.LESS_THAN_OR_EQUAL](
        studentsPassing.length,
        constraint.threshold.upperBound
      );

      if (!passesLowerBound || !passesUpperBound) {
        error = true;
        info += '';
      }
    }
    return { error: error, info: info };
  }
}
