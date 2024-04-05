import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/api/models';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { facDeleteIcon } from 'src/assets/icons/icons';
import { ConstraintBuilderOverlayComponent } from '../constraint-builder-overlay/constraint-builder-overlay.component';

@Component({
  selector: 'app-constraint-summary-view',
  templateUrl: './constraint-summary-view.component.html',
  styleUrl: './constraint-summary-view.component.scss',
})
export class ConstraintSummaryViewComponent implements OverlayComponent, OnInit {
  data = {};
  facDeleteIcon = facDeleteIcon;

  constraintWrappers: ConstraintWrapper[] = [];
  projects: Project[] = [];

  constructor(
    private overlayService: OverlayService,
    private constraintsService: ConstraintsService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    this.constraintWrappers = this.constraintsService.getConstraints();
    this.projects = this.projectsService.getProjects();
  }

  showConstraintBuilderOverlay(): void {
    this.overlayService.closeOverlay();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintBuilderOverlayComponent, {});
    }, 10);
  }

  deleteConstraintWrapper(constraintWrapper: ConstraintWrapper): void {
    this.constraintsService.deleteConstraint(constraintWrapper);
    this.constraintWrappers = this.constraintsService.getConstraints();
  }
}
