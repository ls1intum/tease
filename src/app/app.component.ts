import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {Person} from "./shared/models/person";
import {ToolbarService} from "./shared/ui/toolbar.service";

@Component({
  selector   : 'app',
  templateUrl: './app.component.html',
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  private buttonName: string = "Skip";

  constructor(private toolbarService: ToolbarService){
    toolbarService.buttonNameChanged.subscribe(newName => {
      this.buttonName = newName;
    });
  }
}
