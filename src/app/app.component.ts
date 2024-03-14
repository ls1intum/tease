import { Component, ComponentFactoryResolver, Type, ViewChild, ViewEncapsulation } from '@angular/core';
import { TeamService } from './shared/layers/business-logic-layer/team.service';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { OverlayHostDirective } from './overlay-host.directive';
import { OverlayComponent, OverlayService, OverlayServiceHost } from './overlay.service';
import { ImportOverlayComponent } from './dashboard/import-overlay/import-overlay.component';
import { ConfirmationOverlayComponent } from './dashboard/confirmation-overlay/confirmation-overlay.component';
import { ExportOverlayComponent } from './dashboard/export-overlay/export-overlay.component';
import { StudentsService } from './shared/data/students.service';
import { ProjectsService } from './shared/data/projects.service';
import { AllocationsService } from './shared/data/allocations.service';
import { SkillsService } from './shared/data/skills.service';
import { ConstraintBuilderComponent } from './dashboard/constraint-builder-overlay/constraint-builder.component';
import { ConstraintsOverlayComponent } from './dashboard/constraints-overlay/constraints-overlay.component';
import { ConstraintsService } from './shared/data/constraints.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None, // This is needed to get the material icons to work. Angular bug?
})
export class AppComponent implements OverlayServiceHost {
  overlayVisible = false;

  @ViewChild(DashboardComponent)
  dashboardComponent: DashboardComponent;

  @ViewChild(OverlayHostDirective)
  private overlayHostDirective: OverlayHostDirective;

  constructor(
    public overlayService: OverlayService,
    private teamService: TeamService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private studentsService: StudentsService,
    private projectsService: ProjectsService,
    private allocationsService: AllocationsService,
    private skillsService: SkillsService,
    private constraintsService: ConstraintsService
  ) {
    this.overlayService.host = this;
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

  showSortConfirmation() {
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Sort',
      actionDescription: 'Sorting all teams will destroy the current order of persons.',
      onConfirmed: () => {
        this.teamService.sortPersons();
        this.teamService.saveToLocalBrowserStorage();
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
      overwriteWarning: this.dashboardComponent.dataLoaded,
    });
  }

  showExportOverlay() {
    this.overlayService.displayComponent(ExportOverlayComponent, {
      onDownloadFinished: () => {
        this.teamService.readFromBrowserStorage(), this.overlayService.closeOverlay();
      },
    });
  }

  openConstraintsDialog(): void {
    this.overlayService.displayComponent(ConstraintsOverlayComponent, {});
  }

  protected areAllTeamsEmpty(): boolean {
    return this.teamService.teams.reduce((acc, team) => acc && !team.persons.length, true);
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

  showConstraintBuilderOverlay(): void {
    this.overlayService.displayComponent(ConstraintBuilderComponent, {});
  }

  deleteData() {
    this.studentsService.deleteStudents();
    this.projectsService.deleteProjects();
    this.allocationsService.deleteAllocations();
    this.skillsService.deleteSkills();
    this.constraintsService.deleteConstraints();
  }
}
