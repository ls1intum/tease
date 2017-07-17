import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ToolbarService} from "./shared/ui/toolbar.service";
import {CustomPersonDetailDialogService} from "./shared/ui/custom-person-detail-dialog.service";
import {Person} from "./shared/models/person";
import {TeamService} from "./shared/layers/business-logic-layer/team.service";
import {ExamplePersonPropertyCsvRemotePath} from "./shared/constants/csv.constants";


@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CustomPersonDetailDialogService]
})
export class AppComponent {
  private buttonName: string = "Skip";
  private isButtonVisible: boolean = true;
  private isToolbarVisible: boolean = true;
  private isScoreVisible: boolean = false;
  private totalScore: number = 0;
  private personDetailDialogDisplayedPerson: Person = null;

  constructor(private toolbarService: ToolbarService,
              private customPersonDetailDialogService: CustomPersonDetailDialogService,
              private teamService: TeamService) {
    toolbarService.buttonNameChanged.subscribe(newName => {
      this.buttonName = newName;
    });
    toolbarService.buttonVisibilityChanged.subscribe(isVisible => {
      this.isButtonVisible = isVisible;
    });
    toolbarService.toolbarVisibilityChanged.subscribe(isVisible => {
      this.isToolbarVisible = isVisible;
    });
    toolbarService.scoreVisibilityChanged.subscribe(isVisible => {
      this.isScoreVisible = isVisible;
    });
    toolbarService.totalScoreChanged.subscribe(newValue => {
      this.totalScore = newValue;
    });

    customPersonDetailDialogService.displayedPersonEventEmitter.subscribe(displayedPerson => {
      this.personDetailDialogDisplayedPerson = displayedPerson
    });
  }

  exportFile() {
    this.teamService.exportTeams();
  }

  loadExampleData() {
    this.teamService.readRemoteTeamData(ExamplePersonPropertyCsvRemotePath).then(teams => {
      this.teamService.saveTeams(teams).then(saved => {
        //return this.gotoPersonList();
      });
    });
  }

  closePersonDetailDialog() {
    console.log("closePersonDetailDialog()");
    this.customPersonDetailDialogService.displayedPersonEventEmitter.emit(null);
  }

  onButtonClicked() {
    this.toolbarService.onButtonClicked();
  }
}
