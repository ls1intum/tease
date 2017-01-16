import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Person} from "./shared/models/person";
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

  constructor(private toolbarService: ToolbarService,
  private router: Router){
    toolbarService.buttonNameChanged.subscribe(newName => {
      this.buttonName = newName;
    });
    toolbarService.buttonVisibilityChanged.subscribe(isVisible => {
      this.isButtonVisible = isVisible;
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
