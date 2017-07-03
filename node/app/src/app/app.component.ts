import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ToolbarService} from "./shared/ui/toolbar.service";
import {Router} from "@angular/router";
import {CustomPersonDetailDialogService} from "./shared/ui/custom-person-detail-dialog.service";
import {Person} from "./shared/models/person";


@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css", "./app.component.scss"],
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
              private router: Router,
              private customPersonDetailDialogService: CustomPersonDetailDialogService) {
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
      console.log("app.component.ts: event received! " + displayedPerson);
      this.personDetailDialogDisplayedPerson = displayedPerson
    });
  }

  closePersonDetailDialog() {
    console.log("closePersonDetailDialog()");
    this.customPersonDetailDialogService.displayedPersonEventEmitter.emit(null);
  }

  onButtonClicked() {
    this.toolbarService.onButtonClicked();
  }

  gotoHome(): Promise<boolean> {
    let link = ["/"];
    return this.router.navigate(link);
  }
}
