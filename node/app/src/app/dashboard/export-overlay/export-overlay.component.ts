import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';

@Component({
  selector: 'app-export-overlay',
  templateUrl: './export-overlay.component.html',
  styleUrls: ['./export-overlay.component.scss']
})
export class ExportOverlayComponent implements OnInit, OverlayComponent {
  public data: {};

  constructor(private teamService: TeamService) { }
  ngOnInit() {}

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }
}
