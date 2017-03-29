import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {ToolbarService} from "./shared/ui/toolbar.service";
import {Router} from "@angular/router";


@Component({
  selector   : 'app',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css","./app.component.scss"]
})
export class AppComponent {
  private buttonName: string = "Skip";
  private isButtonVisible: boolean = true;
  private isToolbarVisible: boolean = true;
  private totalScore: number = 0;

  constructor(private toolbarService: ToolbarService,
  private router: Router){
    toolbarService.buttonNameChanged.subscribe(newName => {
      this.buttonName = newName;
    });
    toolbarService.buttonVisibilityChanged.subscribe(isVisible => {
      this.isButtonVisible = isVisible;
    });
    toolbarService.toolbarVisibilityChanged.subscribe(isVisible => {
      this.isToolbarVisible = isVisible;
    });
    toolbarService.totalScoreChanged.subscribe(newValue => {
      this.totalScore = newValue;
    });
  }

  onButtonClicked(){
    this.toolbarService.onButtonClicked();
  }

  gotoHome() {
    let link = ["/"];
    this.router.navigate(link);
  }
}
