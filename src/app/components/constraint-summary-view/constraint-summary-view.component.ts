import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/api/models';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import {
  facAddIcon,
  facConstraintIcon,
  facDeleteIcon,
  facEditIcon,
  facFlagIcon,
  facGroupsIcon,
} from 'src/assets/icons/icons';
import { ConstraintBuilderOverlayComponent } from '../constraint-builder-overlay/constraint-builder-overlay.component';
import { LocksService } from 'src/app/shared/data/locks.service';
import { ConstraintBuilderService } from 'src/app/shared/matching/constraints/constraint-builder/constraint-builder.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { MatchingService } from 'src/app/shared/matching/matching.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { StudentSortService } from 'src/app/shared/services/student-sort.service';
import { ConstraintBuilderNationalityComponent } from '../constraint-builder-nationality/constraint-builder-nationality.component';

@Component({
  selector: 'app-constraint-summary-view',
  templateUrl: './constraint-summary-view.component.html',
  styleUrl: './constraint-summary-view.component.scss',
})
export class ConstraintSummaryViewComponent implements OverlayComponent, OnInit {
  data = {};
  facDeleteIcon = facDeleteIcon;
  facGroupsIcon = facGroupsIcon;
  facAddIcon = facAddIcon;
  facEditIcon = facEditIcon;
  facFlagIcon = facFlagIcon;

  constraintWrappers: ConstraintWrapper[] = [];
  projects: Project[] = [];

  constructor(
    private overlayService: OverlayService,
    private constraintsService: ConstraintsService,
    private projectsService: ProjectsService,
    private studentsService: StudentsService,
    private locksService: LocksService,
    private constraintsBuilderService: ConstraintBuilderService,
    private matchingService: MatchingService,
    private allocationsService: AllocationsService,
    private toastsService: ToastsService,
    private studentSortService: StudentSortService
  ) {}

  ngOnInit(): void {
    this.constraintWrappers = this.constraintsService.getConstraints();
    this.projects = this.projectsService.getProjects();
  }

  showConstraintNationalityBuilderOverlay(): void {
    this.cancel();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintBuilderNationalityComponent, {});
    }, 10);
  }

  showConstraintBuilderOverlay(constraintWrapper: ConstraintWrapper): void {
    this.cancel();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintBuilderOverlayComponent, {
        constraintWrapper: constraintWrapper,
        onClosed: () => {
          this.overlayService.closeOverlay();
          setTimeout(() => {
            this.overlayService.displayComponent(ConstraintSummaryViewComponent, {});
          }, 10);
        },
      });
    }, 10);
  }

  cancel(): void {
    this.overlayService.closeOverlay();
  }

  deleteConstraintWrapper(id: string): void {
    this.constraintsService.deleteConstraint(id);
    this.constraintWrappers = this.constraintsService.getConstraints();
  }

  setActive(id: string, active: boolean): void {
    this.constraintsService.setActive(id, active);
    this.constraintWrappers = this.constraintsService.getConstraints();
  }

  async distributeTeams(): Promise<void> {
    const locks = this.locksService.getLocks();
    const activeConstraintWrappers = this.constraintWrappers.filter(constraintWrapper => constraintWrapper.isActive);
    const constraints = this.constraintsBuilderService.createConstraints(
      this.studentsService.getStudents(),
      this.projects.map(project => project.id),
      activeConstraintWrappers,
      locks
    );
    const allocations = await this.matchingService.getAllocations(constraints);
    if (allocations) {
      this.allocationsService.setAllocations(
        this.studentSortService.sortStudentsInAllocations(this.studentsService.getStudents(), allocations)
      );
      this.cancel();
      this.toastsService.showToast('Distribution Complete', 'Success', true);
    }
  }
}
