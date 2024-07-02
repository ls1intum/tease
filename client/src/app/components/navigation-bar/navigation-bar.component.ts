import { Component, Input } from '@angular/core';
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
import { CollaborationService } from 'src/app/shared/services/collaboration.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {
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
    private collaborationService: CollaborationService,
    public websocketService: WebsocketService
  ) {}

  async connect(): Promise<void> {
    console.log('Connecting to collaboration service');
    await this.collaborationService.connect(this.allocationData.courseIteration.id);
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from collaboration service');
    await this.collaborationService.disconnect();
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
    this.overlayService.displayComponent(ConstraintSummaryComponent);
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
    this.overlayService.displayComponent(ImportOverlayComponent);
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
      primaryText: 'Delete',
      primaryButtonClass: 'btn-warn',
      primaryAction: () => {
        this.deleteData();
        this.overlayService.closeOverlay();
      },
      secondaryText: 'Keep Data',
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
