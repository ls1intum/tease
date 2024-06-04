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
import { ConstraintWrapper } from './shared/matching/constraints/constraint';
import { AllocationData, ProjectConstraint, ProjectData } from './shared/models/allocation-data';
import { PromptService } from './shared/services/prompt.service';
import { CourseIterationsService } from './shared/data/course-iteration.service';
import { ConfirmationOverlayComponent } from './components/confirmation-overlay/confirmation-overlay.component';
import { ImportOverlayComponent } from './components/import-overlay/import-overlay.component';

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
      this.constraintsService.constraints$.subscribe(constraintWrappers => {
        this.constraintWrappers = constraintWrappers;
        this.updateData();
      })
    );

    this.fetchCourseIterations();
  }

  private updateDataLoaded(): void {
    this.dataLoaded = !!(
      this.students?.length &&
      this.projects?.length &&
      this.skills?.length &&
      this.allocations &&
      this.constraintWrappers
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
      courseIteration: this.courseIterationsService.getCourseIteration(),
    };
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
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Open Import',
      actionDescription: 'There is a newer course iteration available.',
      onConfirmed: () => {
        this.overlayService.closeOverlay();
        setTimeout(() => {
          this.overlayService.displayComponent(ImportOverlayComponent, {});
        }, 10);
      },
      onCancelled: () => this.overlayService.closeOverlay(),
    });
  }

  private updateProjectsData(): ProjectData[] {
    return this.projects.map(project => this.updateProjectData(project));
  }

  private updateProjectData(project: Project): ProjectData {
    let studentsOfProject = this.getStudentsOfProject(project.id);
    const { projectConstraints, fulfillsAllConstraints } = this.getProjectConstraints(project.id, studentsOfProject);

    return {
      project: project,
      projectConstraints: projectConstraints,
      fulfillsAllConstraints: fulfillsAllConstraints,
      students: studentsOfProject,
    };
  }

  private getStudentsOfProject(projectId: string): Student[] {
    const allocation = this.allocations.find(allocation => allocation.projectId === projectId);
    return allocation
      ? allocation.students.map(studentId => this.students.find(student => student.id === studentId))
      : [];
  }

  private getProjectConstraints(
    projectId: string,
    students: Student[]
  ): { projectConstraints: ProjectConstraint[]; fulfillsAllConstraints: Boolean } {
    let fulfillsAllConstraints = true;
    const constraintWrappersOfProject = this.getConstraintWrappersOfProject(projectId);
    const projectConstraints = constraintWrappersOfProject.map(constraintWrapper => {
      const numberOfStudents = this.getNumberOfStudents(constraintWrapper, students);

      const fulfillsLowerBound = constraintWrapper.threshold.lowerBound <= numberOfStudents;
      const fulfillsUpperBound = constraintWrapper.threshold.upperBound >= numberOfStudents;
      if (!fulfillsLowerBound || !fulfillsUpperBound) {
        fulfillsAllConstraints = false;
      }

      return { constraintWrapper: constraintWrapper, numberOfStudents: numberOfStudents };
    });

    return { projectConstraints: projectConstraints, fulfillsAllConstraints: fulfillsAllConstraints };
  }

  private getConstraintWrappersOfProject(projectId: string): ConstraintWrapper[] {
    const activeConstraintWrappers = this.constraintWrappers.filter(constraintWrapper => constraintWrapper.isActive);
    return activeConstraintWrappers.filter(constraintWrapper => constraintWrapper.projectIds.includes(projectId));
  }

  private getNumberOfStudents(constraintWrapper: ConstraintWrapper, students: Student[]): number {
    const studentIdsOfProject = students.map(student => student.id);
    return constraintWrapper.constraintFunction.students.filter(student => studentIdsOfProject.includes(student.id))
      .length;
  }

  private updateStudentsWithoutTeam(): Student[] {
    return this.students.filter(
      student => !this.allocations.some(allocation => allocation.students.includes(student.id))
    );
  }
}
