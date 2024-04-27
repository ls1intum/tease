import { Component } from '@angular/core';
import { OverlayComponent, OverlayService } from 'src/app/overlay.service';
import { ConstraintWrapper } from 'src/app/shared/matching/constraints/constraint';
import { facCloseIcon, facPersonThinIcon } from 'src/assets/icons/icons';
import { ConstraintBuilderOverlayComponent } from '../constraint-builder-overlay/constraint-builder-overlay.component';

interface ProjectExample {
  valid: boolean;
  name: string;
  students: boolean[];
}

interface DistributionExample {
  projects: ProjectExample[];
  name: string;
  valid: boolean;
}

@Component({
  selector: 'app-constraint-help',
  templateUrl: './constraint-help.component.html',
  styleUrl: './constraint-help.component.scss',
})
export class ConstraintHelpComponent implements OverlayComponent {
  data: {
    constraintWrapper: ConstraintWrapper;
    onClosed: () => {};
  };
  facCloseIcon = facCloseIcon;
  facPersonThinIcon = facPersonThinIcon;

  distributionExamples: DistributionExample[] = [
    {
      name: 'I.',
      valid: true,
      projects: [
        { name: 'Project A', valid: true, students: [true, true, true, false, false] },
        { name: 'Project B', valid: true, students: [true, true, false, false, false] },
        { name: 'Project C', valid: true, students: [false, false, false, false, false] },
      ],
    },
    {
      name: 'II.',
      valid: true,
      projects: [
        { name: 'Project A', valid: true, students: [true, false, false, false, false] },
        { name: 'Project B', valid: true, students: [true, false, false, false, false] },
        { name: 'Project C', valid: true, students: [true, true, true, false, false] },
      ],
    },
    {
      name: 'III.',
      valid: false,
      projects: [
        { name: 'Project A', valid: false, students: [false, false, false, false, false] },
        { name: 'Project B', valid: true, students: [true, true, true, false, false] },
        { name: 'Project C', valid: true, students: [true, true, false, false, false] },
      ],
    },
    {
      name: 'IV.',
      valid: false,
      projects: [
        { name: 'Project A', valid: true, students: [true, false, false, false, false] },
        { name: 'Project B', valid: false, students: [true, true, true, true, false] },
        { name: 'Project C', valid: true, students: [false, false, false, false, false] },
      ],
    },
    // [
    //   { name: 'Project A', valid: true, students: [true, false, false, false, false] },
    //   { name: 'Project B', valid: true, students: [true, false, false, false, false] },
    //   { name: 'Project C', valid: true, students: [true, true, true, false, false] },
    // ],
    // [
    //   { name: 'Project A', valid: false, students: [false, false, false, false, false] },
    //   { name: 'Project B', valid: true, students: [true, true, true, false, false] },
    //   { name: 'Project C', valid: true, students: [true, true, false, false, false] },
    // ],
    // [
    //   { name: 'Project A', valid: true, students: [true, false, false, false, false] },
    //   { name: 'Project B', valid: false, students: [true, true, true, true, false] },
    //   { name: 'Project C', valid: true, students: [false, false, false, false, false] },
    // ],
  ];

  studentsData = [false, false, true, true, true, false, true, false, true];
  projectsData: { name: string; active: boolean }[] = [
    { name: 'Project A', active: true },
    { name: 'Project B', active: true },
    { name: 'Project C', active: false },
  ];

  constructor(private overlayService: OverlayService) {}

  close(): void {
    this.overlayService.closeOverlay();
    setTimeout(() => {
      this.overlayService.displayComponent(ConstraintBuilderOverlayComponent, {
        constraintWrapper: this.data.constraintWrapper,
        onClosed: this.data.onClosed,
      });
    }, 10);
  }
}
