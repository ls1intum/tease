import { Component, ComponentFactoryResolver, EventEmitter, Type, ViewChild, ViewEncapsulation } from '@angular/core';
import { TeamService } from './shared/layers/business-logic-layer/team.service';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { OverlayHostDirective } from './overlay-host.directive';
import { OverlayComponent, OverlayService, OverlayServiceHost } from './overlay.service';
import { ImportOverlayComponent } from './dashboard/import-overlay/import-overlay.component';
import { ConfirmationOverlayComponent } from './dashboard/confirmation-overlay/confirmation-overlay.component';
import { StudentHighlightingOverlayComponent } from './dashboard/student-highlighting-overlay/student-highlighting-overlay.component';
import { Location } from '@angular/common';
import { ExportOverlayComponent } from './dashboard/export-overlay/export-overlay.component';
import { ConstraintLoggingService } from './shared/layers/business-logic-layer/constraint-logging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None, // This is needed to get the material icons to work. Angular bug?
})
export class AppComponent implements OverlayServiceHost {
  overlayVisible = false;
  onTeamStatisticsButtonPressed = new EventEmitter<boolean>();
  toggleTeamStatisticsButtonState = true;

  @ViewChild(DashboardComponent)
  dashboardComponent: DashboardComponent;

  @ViewChild(OverlayHostDirective)
  private overlayHostDirective: OverlayHostDirective;

  constructor(
    public overlayService: OverlayService,
    private teamService: TeamService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private location: Location
  ) {
    this.overlayService.host = this;

    // disable back button
    if (typeof history.pushState !== 'undefined') {
      const pushState = () => {
        history.pushState(null, '', '#TEASE');
      };
      pushState();
      this.location.subscribe(event => {
        pushState();
      });
    }

    ConstraintLoggingService.load();
  }

  showResetTeamAllocationConfirmation() {
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Reset',
      actionDescription: 'Resetting the team allocation will unpin all students and remove them from their teams.',
      onConfirmed: () => {
        this.teamService.resetPinnedStatus();
        this.teamService.resetTeamAllocation();
        this.teamService.saveToLocalBrowserStorage();
        this.overlayService.closeOverlay();
      },
      onCancelled: () => this.overlayService.closeOverlay(),
    });
  }

  showSortConfirmation() {
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Sort',
      actionDescription: 'Sorting all teams will destroy the current order of students.',
      onConfirmed: () => {
        this.teamService.sortStudents();
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
      overwriteWarning: this.dashboardComponent.isDataLoaded(),
    });
  }

  showExportOverlay() {
    this.overlayService.displayComponent(ExportOverlayComponent, {});
  }

  showStudentHighlightingOverlay() {
    this.overlayService.displayComponent(StudentHighlightingOverlayComponent, {});
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
    const viewContainerRef = this.overlayHostDirective.viewContainerRef;
    viewContainerRef.clear();
  }
}
