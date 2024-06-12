import { Component, Input, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { ConfirmationOverlayComponent } from '../confirmation-overlay/confirmation-overlay.component';
import { ExportOverlayComponent } from '../export-overlay/export-overlay.component';
import { ImportOverlayComponent } from '../import-overlay/import-overlay.component';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { teaseIconPack } from 'src/assets/icons/icons';
import { LockedStudentsService } from 'src/app/shared/data/locked-students.service';
import { ConstraintBuilderOverlayComponent } from '../constraint-builder-overlay/constraint-builder-overlay.component';
import { ConstraintSummaryComponent } from '../constraint-summary-view/constraint-summary.component';
import { StudentSortService } from 'src/app/shared/services/student-sort.service';
import { AllocationData } from 'src/app/shared/models/allocation-data';
import { CourseIterationsService } from 'src/app/shared/data/course-iteration.service';
import { WebsocketService } from 'src/app/shared/network/websocket.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent implements OnInit {
  facGroupsIcon = teaseIconPack['facGroupsIcon'];
  facDeleteIcon = teaseIconPack['facDeleteIcon'];
  facMoreIcon = teaseIconPack['facMoreIcon'];
  facImportIcon = teaseIconPack['facImportIcon'];
  facExportIcon = teaseIconPack['facExportIcon'];
  facRestartIcon = teaseIconPack['facRestartIcon'];
  facSkillCircleIcon = teaseIconPack['facSkillCircleIcon'];
  facSkillSideIcon = teaseIconPack['facSkillSideIcon'];
  facSkillDeathIcon = teaseIconPack['facSkillDeathIcon'];
  facAddIcon = teaseIconPack['facAddIcon'];
  facSortIcon = teaseIconPack['facSortIcon'];
  facCheckIcon = teaseIconPack['facCheckIcon'];

  @Input({ required: true }) allocationData: AllocationData;

  constructor(
    private overlayService: OverlayService,
    private allocationsService: AllocationsService,
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private constraintsService: ConstraintsService,
    private lockedStudentsService: LockedStudentsService,
    private studentSortService: StudentSortService,
    private courseIterationsService: CourseIterationsService,
    public websocketService: WebsocketService
  ) {}

  ngOnInit(): void {}

  async discover() {
    const courseIterationId = this.allocationData.courseIteration?.id;
    if (!courseIterationId) {
      return;
    }
    const serverCollaborationData = await this.websocketService.discover(courseIterationId);
    if (!serverCollaborationData || !serverCollaborationData.allocations) {
      this.subscribe();
      return;
    }

    if (
      this.allocationsService.equals(serverCollaborationData.allocations) &&
      this.constraintsService.equals(serverCollaborationData.constraints) &&
      this.lockedStudentsService.equalsAsArray(serverCollaborationData.lockedStudents)
    ) {
      this.subscribe();
      return;
    }

    const overlayData = {
      title: 'Connected to Collaboration Service',
      description:
        'The Collaboration Service has a different allocations and constraints state available. Do you want to load it? This will overwrite your current allocations, constraints and locked students. Not loading it will overwrite the other data. Be careful, this action cannot be undone.',
      primaryText: 'Use Collaboration Data',
      primaryAction: async () => {
        const serverCollaborationData = await this.websocketService.discover(courseIterationId);
        this.allocationsService.setAllocations(serverCollaborationData.allocations, false);
        this.constraintsService.setConstraints(serverCollaborationData.constraints, false);
        this.lockedStudentsService.setLocksAsArray(serverCollaborationData.lockedStudents, false);
        await this.subscribe();
        this.overlayService.closeOverlay();
      },
      secondaryText: 'Overwrite Collaboration Data',
      secondaryButtonStyle: 'btn-warn',
      secondaryAction: async () => {
        await this.subscribe();
        this.overlayService.closeOverlay();
      },
      isDissmissable: false,
    };

    this.overlayService.displayComponent(ConfirmationOverlayComponent, overlayData);
  }

  async subscribe() {
    const courseIterationId = this.allocationData.courseIteration?.id;
    if (!courseIterationId) {
      return;
    }

    this.websocketService.send(courseIterationId, 'allocations', this.allocationsService.getAllocationsAsString());

    this.websocketService.subscribe(courseIterationId, 'allocations', allocations => {
      this.allocationsService.setAllocations(allocations, false);
    });

    this.websocketService.send(courseIterationId, 'lockedStudents', this.lockedStudentsService.getLocksAsString());

    this.websocketService.subscribe(courseIterationId, 'lockedStudents', lockedStudents => {
      this.lockedStudentsService.setLocksAsArray(lockedStudents, false);
    });

    this.websocketService.send(courseIterationId, 'constraints', this.constraintsService.getConstraintsAsString());

    this.websocketService.subscribe(courseIterationId, 'constraints', constraints => {
      this.constraintsService.setConstraints(constraints, false);
    });
  }

  dropdownItems = [
    { action: this.showExportOverlay.bind(this), icon: this.facExportIcon, label: 'Export', class: 'text-dark' },
    { action: this.showImportOverlay.bind(this), icon: this.facImportIcon, label: 'Import', class: 'text-dark' },
    {
      action: this.showResetTeamAllocationConfirmation.bind(this),
      icon: this.facRestartIcon,
      label: 'Restart',
      class: 'text-dark',
    },
    { action: this.showDeleteConfirmation.bind(this), icon: this.facDeleteIcon, label: 'Delete', class: 'text-warn' },
  ];

  showConstraintSummaryOverlay(): void {
    this.overlayService.displayComponent(ConstraintSummaryComponent, {});
  }

  showConstraintBuilderOverlay(): void {
    this.overlayService.displayComponent(ConstraintBuilderOverlayComponent, {
      onClosed: () => this.overlayService.closeOverlay(),
    });
  }

  showResetTeamAllocationConfirmation() {
    const overlayData = {
      title: 'Reset Team Allocation',
      description:
        'Are you sure you want to reset the team allocation? Resetting the team allocation will unpin all students and remove them from their projects. This action cannot be undone.',
      primaryText: 'Reset',
      primaryButtonClass: 'btn-warn',
      primaryAction: () => {
        this.deleteDynamicData();
        this.overlayService.closeOverlay();
      },
    };

    this.overlayService.displayComponent(ConfirmationOverlayComponent, overlayData);
  }

  showImportOverlay() {
    this.overlayService.displayComponent(ImportOverlayComponent, {
      onTeamsImported: () => {
        this.overlayService.closeOverlay();
      },
      overwriteWarning: false,
    });
  }

  showExportOverlay() {
    this.overlayService.displayComponent(ExportOverlayComponent, {
      allocationData: this.allocationData,
    });
  }

  showSortConfirmation() {
    const overlayData = {
      title: 'Sort Students',
      description: 'Sort students inside projects by their intro course proficiency. This action cannot be undone.',
      primaryText: 'Sort Students',
      primaryButtonClass: 'btn-primary',
      primaryAction: () => {
        this.allocationsService.setAllocations(
          this.studentSortService.sortStudentsInAllocations(
            this.studentsService.getStudents(),
            this.allocationsService.getAllocations()
          )
        );
        this.overlayService.closeOverlay();
      },
    };

    this.overlayService.displayComponent(ConfirmationOverlayComponent, overlayData);
  }

  showDeleteConfirmation() {
    const overlayData = {
      title: 'Delete',
      description:
        'Permanently erase all data, including students, allocations and constraints. This action cannot be undone.',
      primaryText: 'DELETE',
      primaryButtonClass: 'btn-warn',
      primaryAction: () => {
        this.deleteData();
        this.overlayService.closeOverlay();
      },
      secondaryText: 'Keep Data',
      secondaryButtonStyle: 'btn-primary',
    };

    this.overlayService.displayComponent(ConfirmationOverlayComponent, overlayData);
  }

  private deleteData() {
    this.studentsService.deleteStudents();
    this.projectsService.deleteProjects();
    this.allocationsService.deleteAllocations();
    this.skillsService.deleteSkills();

    this.constraintsService.deleteConstraints();
    this.courseIterationsService.setCourseIteration();

    this.overlayService.closeOverlay();
  }

  private deleteDynamicData() {
    this.lockedStudentsService.deleteLocks();
    this.allocationsService.deleteAllocations();
  }
}
