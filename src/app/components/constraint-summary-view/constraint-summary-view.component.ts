import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/api/models';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { facConstraintIcon, facDeleteIcon, facGroupsIcon } from 'src/assets/icons/icons';
import { ConstraintBuilderOverlayComponent } from '../constraint-builder-overlay/constraint-builder-overlay.component';
import { LocksService } from 'src/app/shared/data/locks.service';
import { ConstraintBuilderService } from 'src/app/shared/matching/constraints/constraint-builder/constraint-builder.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { MatchingService } from 'src/app/shared/matching/matching.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';

@Component({
  selector: 'app-constraint-summary-view',
  templateUrl: './constraint-summary-view.component.html',
  styleUrl: './constraint-summary-view.component.scss',
})
export class ConstraintSummaryViewComponent implements OverlayComponent, OnInit {
  data = {};
  facDeleteIcon = facDeleteIcon;
  facGroupsIcon = facGroupsIcon;
  facConstraintIcon = facConstraintIcon;

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
    private allocationsService: AllocationsService
  ) {}

  ngOnInit(): void {
    this.constraintWrappers = this.constraintsService.getConstraints();
    this.projects = this.projectsService.getProjects();
  }

  showConstraintBuilderOverlay(): void {
    this.cancel();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintBuilderOverlayComponent, {
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

  deleteConstraintWrapper(constraintWrapper: ConstraintWrapper): void {
    this.constraintsService.deleteConstraint(constraintWrapper);
    this.constraintWrappers = this.constraintsService.getConstraints();
  }

  async distributeTeams(): Promise<void> {
    const locks = this.locksService.getLocks();
    const constraints = this.constraintsBuilderService.createConstraints(
      this.studentsService.getStudents(),
      this.projects.map(project => project.id),
      this.constraintWrappers,
      locks
    );
    const allocations = await this.matchingService.getAllocations(constraints);
    if (allocations) {
      this.allocationsService.setAllocations(allocations);
      close();
    }
  }
}
