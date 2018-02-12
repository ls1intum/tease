import {Component, ComponentFactoryResolver, Type, ViewChild, ViewEncapsulation} from '@angular/core';
import {TeamService} from './shared/layers/business-logic-layer/team.service';
import {DashboardComponent} from './dashboard/dashboard/dashboard.component';
import {OverlayHostDirective} from './overlay-host.directive';
import {OverlayComponent, OverlayService, OverlayServiceHost} from './overlay.service';
import {ImportOverlayComponent} from './dashboard/import-overlay/import-overlay.component';
import {ConfirmationOverlayComponent} from './dashboard/confirmation-overlay/confirmation-overlay.component';
import {PersonHighlightingOverlayComponent} from './dashboard/person-highlighting-overlay/person-highlighting-overlay.component';
import {Location} from '@angular/common';

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

  constructor(public overlayService: OverlayService,
              private teamService: TeamService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private location: Location) {
    this.overlayService.host = this;

    // disable back button
    if (typeof history.pushState !== 'undefined') {
      const pushState = () => { history.pushState(null, '', '#back-disabled'); };
      pushState();
      this.location.subscribe(event => {
        pushState();
      });
    }
  }

  exportData() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }

  showResetTeamAllocationConfirmation() {
    this.overlayService.displayComponent(ConfirmationOverlayComponent, {
      action: 'Reset',
      actionDescription: 'Resetting the team allocation will unpin all persons and remove them from their teams.',
      onConfirmed: () => {
        this.teamService.resetPinnedStatus();
        this.teamService.resetTeamAllocation();
        this.teamService.saveToLocalBrowserStorage();
        this.overlayService.closeOverlay();
      },
      onCancelled: () => this.overlayService.closeOverlay()
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
      onCancelled: () => this.overlayService.closeOverlay()
    });
  }

  showImportOverlay() {
    this.overlayService.displayComponent(ImportOverlayComponent, {
      onTeamsImported: () => {
        this.overlayService.closeOverlay();
      },
      overwriteWarning: this.dashboardComponent.isDataLoaded()
    });
  }

  showPersonHighlightingOverlay() {
    this.overlayService.displayComponent(PersonHighlightingOverlayComponent, {});
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
