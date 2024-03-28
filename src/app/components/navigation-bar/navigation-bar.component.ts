import { Component } from '@angular/core';
import { OverlayService } from 'src/app/overlay.service';
import { ConfirmationOverlayComponent } from '../confirmation-overlay/confirmation-overlay.component';
import { ConstraintBuilderComponent } from '../constraint-builder-overlay/constraint-builder.component';
import { ConstraintsOverlayComponent } from '../constraints-overlay/constraints-overlay.component';
import { ExportOverlayComponent } from '../export-overlay/export-overlay.component';
import { ImportOverlayComponent } from '../import-overlay/import-overlay.component';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { teaseIconPack } from 'src/assets/icons/icons';

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

  constructor(
    private overlayService: OverlayService,
    private allocationsService: AllocationsService,
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private constraintsService: ConstraintsService
  ) {}

  dropdownItems = [
    { action: this.showExportOverlay.bind(this), icon: this.facExportIcon, label: 'Export', class: 'text-dark' },
    { action: this.showImportOverlay.bind(this), icon: this.facImportIcon, label: 'Import', class: 'text-dark' },
    {
      action: this.showResetTeamAllocationConfirmation.bind(this),
      icon: this.facRestartIcon,
      label: 'Restart',
      class: 'text-dark',
    },
    { action: this.deleteData.bind(this), icon: this.facDeleteIcon, label: 'Delete', class: 'text-warn' },
  ];

  showConstraintBuilderOverlay(): void {
    this.overlayService.displayComponent(ConstraintBuilderComponent, {});
  }

  showConstraintsOverlay(): void {
    this.overlayService.displayComponent(ConstraintsOverlayComponent, {});
  }

  showResetTeamAllocationConfirmation() {
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Reset',
      actionDescription: 'Resetting the team allocation will unpin all persons and remove them from their teams.',
      onConfirmed: () => {
        // TODO: Reset Pinned Status
        this.allocationsService.deleteAllocations();
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
      onDownloadFinished: () => {
        this.overlayService.closeOverlay();
      },
    });
  }

  deleteData() {
    this.studentsService.deleteStudents();
    this.projectsService.deleteProjects();
    this.allocationsService.deleteAllocations();
    this.skillsService.deleteSkills();
    this.constraintsService.deleteConstraints();
  }
}
