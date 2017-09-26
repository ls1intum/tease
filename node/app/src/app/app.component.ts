import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {Person} from './shared/models/person';
import {CustomPersonDetailDialogService} from './shared/ui/custom-person-detail-dialog.service';
import {TeamService} from './shared/layers/business-logic-layer/team.service';
import {ExamplePersonPropertyCsvRemotePath} from './shared/constants/csv.constants';
import {DashboardComponent} from "./dashboard/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None, // This is needed to get the material icons to work. Angular bug?
})
export class AppComponent {
  personDetailDialogDisplayedPerson: Person = null;

  @ViewChild(DashboardComponent)
  private dashboardComponent: DashboardComponent;

  constructor(private customPersonDetailDialogService: CustomPersonDetailDialogService,
              private teamService: TeamService) {

    customPersonDetailDialogService.displayedPersonEventEmitter.subscribe(displayedPerson => {
      this.personDetailDialogDisplayedPerson = displayedPerson;
    });
  }

  closePersonDetailDialog() {
    this.customPersonDetailDialogService.displayedPersonEventEmitter.emit(null);
  }

  exportData() {
    this.teamService.exportTeams();
  }

  protected loadExampleData() {
    this.dashboardComponent.loadExampleData();
  }
}
