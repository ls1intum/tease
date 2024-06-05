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
    const courseIterationId = this.allocationData.courseIteration.id;
    if (!courseIterationId) {
      return;
    }
    const serverCollaborationData = await this.websocketService.discover(courseIterationId);
    if (!serverCollaborationData) {
      this.subscribe();
      return;
    }
    // const storedAllocations = this.allocationsService.getAllocations();
    // if (JSON.stringify(storedAllocations) === JSON.stringify(serverAllocations)) {
    //   this.subscribe();
    //   return;
    // }

    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Overwrite Allocations & Constraints',
      actionDescription:
        'There is a different allocation state available. Do you want to load it? This will overwrite your current allocation. Not loading it will overwrite the other allocation.',
      onConfirmed: async () => {
        await this.subscribe();
        this.overlayService.closeOverlay();
      },
      onCancelled: async () => {
        const serverCollaborationData = await this.websocketService.discover(courseIterationId);
        this.allocationsService.setAllocations(serverCollaborationData.allocations, false);
        this.constraintsService.setConstraints(serverCollaborationData.constraints, false);
        this.lockedStudentsService.setLocksAsArray(serverCollaborationData.lockedStudents, false);
        await this.subscribe();
        this.overlayService.closeOverlay();
      },
    });
  }

  async subscribe() {
    const courseIterationId = this.allocationData.courseIteration.id;
    if (!courseIterationId) {
      return;
    }

    this.websocketService.send(
      courseIterationId,
      'allocations',
      JSON.stringify(this.allocationsService.getAllocations())
    );

    this.websocketService.subscribe(courseIterationId, 'allocations', allocations => {
      this.allocationsService.setAllocations(allocations, false);
    });

    this.websocketService.send(courseIterationId, 'lockedStudents', this.lockedStudentsService.getLocksAsString());

    this.websocketService.subscribe(courseIterationId, 'lockedStudents', lockedStudents => {
      this.lockedStudentsService.setLocksAsArray(lockedStudents, false);
    });

    this.websocketService.send(courseIterationId, 'constraints', this.constraintsService.getConstraintsAsString());

    this.websocketService.subscribe(courseIterationId, 'constraints', constraints => {
      console.log(constraints);
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
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Reset',
      actionDescription: 'Resetting the team allocation will unpin all persons and remove them from their teams.',
      onConfirmed: () => {
        this.deleteDynamicData();
        this.overlayService.closeOverlay();
      },
      onCancelled: () => this.overlayService.closeOverlay(),
    });
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
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Sort',
      actionDescription: 'Sort students by their intro course proficiency.',
      onConfirmed: () => {
        this.allocationsService.setAllocations(
          this.studentSortService.sortStudentsInAllocations(
            this.studentsService.getStudents(),
            this.allocationsService.getAllocations()
          )
        );
        this.overlayService.closeOverlay();
      },
      onCancelled: () => this.overlayService.closeOverlay(),
    });
  }

  showDeleteConfirmation() {
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Delete',
      actionDescription: 'Delete all data. This action cannot be undone.',
      onConfirmed: () => {
        this.deleteData();
        this.overlayService.closeOverlay();
      },
      onCancelled: () => this.overlayService.closeOverlay(),
    });
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
