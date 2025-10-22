import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { OverlayHostDirective } from './overlay-host.directive';
import { OverlayComponentData, OverlayData, OverlayService, OverlayServiceHost } from './overlay.service';
import { DragulaService } from 'ng2-dragula';
import { Allocation, Project, Skill, Student } from 'src/app/api/models';
import { StudentsService } from 'src/app/shared/data/students.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { Subscription } from 'rxjs';
import { ConstraintWrapper } from './shared/matching/constraints/constraint';
import { AllocationData } from './shared/models/allocation-data';
import { PromptService } from './shared/services/prompt.service';
import { CourseIterationsService } from './shared/data/course-iteration.service';
import { ConfirmationOverlayComponent } from './components/confirmation-overlay/confirmation-overlay.component';
import { ImportOverlayComponent } from './components/import-overlay/import-overlay.component';
import { LockedStudentsService } from './shared/data/locked-students.service';
import { AllocationDataService } from './shared/services/allocation-data.service';
import { CollaborationService } from './shared/services/collaboration.service';

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
  private constraintWrappers: ConstraintWrapper[];

  constructor(
    public overlayService: OverlayService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dragulaService: DragulaService,
    private studentsService: StudentsService,
    private allocationsService: AllocationsService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private constraintsService: ConstraintsService,
    private courseIterationsService: CourseIterationsService,
    private promptService: PromptService,
    private lockedStudentsService: LockedStudentsService,
    private allocationDataService: AllocationDataService,
    private collaborationService: CollaborationService
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
        this.updateAllocationData();
      }),
      this.studentsService.students$.subscribe(students => {
        this.students = students;
        this.updateAllocationData();
      }),
      this.projectsService.projects$.subscribe(projects => {
        this.projects = projects;
        this.updateAllocationData();
      }),
      this.skillsService.skills$.subscribe(skills => {
        this.skills = skills;
        this.updateAllocationData();
      }),
      this.constraintsService.constraints$.subscribe(constraintWrappers => {
        this.constraintWrappers = constraintWrappers;
        this.updateAllocationData();
      }),
      this.lockedStudentsService.locks$.subscribe(() => {
        this.updateAllocationData();
      })
    );

    this.fetchCourseIterations();

    const courseIterationId = this.courseIterationsService.getCourseIteration()?.id;
    if (courseIterationId) {
      this.collaborationService.connect(courseIterationId);
    }
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
      this.allocationsService.removeStudentFromAllocations(studentId);
      return;
    }

    this.allocationsService.moveStudentToProjectAtPosition(studentId, projectId, siblingId);
  }

  /* OverlayServiceHost interface */
  public displayComponent(component: Type<OverlayComponentData>, data: OverlayData) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.overlayHostDirective.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as OverlayComponentData).data = data;
    this.overlayVisible = true;
  }

  public closeOverlay() {
    this.overlayVisible = false;
    this.overlayHostDirective.viewContainerRef.clear();
  }

  private updateAllocationData() {
    const allocationData = this.allocationDataService.getAllocationData(
      this.projects,
      this.students,
      this.allocations,
      this.constraintWrappers,
      this.skills
    );

    if (!allocationData) {
      return;
    }
    this.allocationData = allocationData;
    this.dataLoaded = true;
  }

  private async fetchCourseIterations() {
    const courseIteration = this.courseIterationsService.getCourseIteration();
    if (!courseIteration || !this.promptService.isImportPossible()) {
      return;
    }
    const courseIterations = await this.promptService.getCourseIterations();
    if (!courseIterations) {
      return;
    }

    const courseIterationDate = new Date(courseIteration.kickoffSubmissionPeriodEnd);

    let newCourseIterationAvailable = false;
    courseIterations.forEach(async courseIteration => {
      const courseIterationDateToCompare = new Date(courseIteration.kickoffSubmissionPeriodEnd);
      if (courseIterationDateToCompare > courseIterationDate) {
        newCourseIterationAvailable = true;
      }
    });

    if (newCourseIterationAvailable) {
      this.showImportOverlay();
    }
  }

  private showImportOverlay() {
    const overlayData = {
      description:
        'You are currently working on an outdated course iteration. Do you want to import the new course iteration?',
      title: 'New Course Iteration Available',
      primaryText: 'Open Import',
      primaryButtonClass: 'btn-primary',
      primaryAction: () => this.overlayService.switchComponent(ImportOverlayComponent),
    };

    this.overlayService.displayComponent(ConfirmationOverlayComponent, overlayData);
  }
}
