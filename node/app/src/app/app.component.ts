import {Component, ComponentFactoryResolver, Type, ViewChild, ViewEncapsulation} from '@angular/core';
import {TeamService} from './shared/layers/business-logic-layer/team.service';
import {DashboardComponent} from './dashboard/dashboard/dashboard.component';
import {OverlayHostDirective} from './overlay-host.directive';
import {OverlayComponent, OverlayService, OverlayServiceHost} from './overlay.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None, // This is needed to get the material icons to work. Angular bug?
})
export class AppComponent implements OverlayServiceHost {
  protected overlayVisible = false;

  @ViewChild(DashboardComponent)
  private dashboardComponent: DashboardComponent;

  @ViewChild(OverlayHostDirective)
  private overlayHostDirective: OverlayHostDirective;

  constructor(private overlayService: OverlayService,
              private teamService: TeamService,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.overlayService.host = this;
  }

  exportData() {
    this.teamService.exportTeams();
  }

  protected loadExampleData() {
    this.dashboardComponent.loadExampleData();
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
