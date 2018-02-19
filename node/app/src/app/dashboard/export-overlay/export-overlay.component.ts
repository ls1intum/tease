import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import * as html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {Person} from '../../shared/models/person';

@Component({
  selector: 'app-export-overlay',
  templateUrl: './export-overlay.component.html',
  styleUrls: ['./export-overlay.component.scss']
})
export class ExportOverlayComponent implements OnInit, OverlayComponent {
  public data: {};

  @ViewChild(PersonDetailOverlayComponent) personDetailOverlayComponent: PersonDetailOverlayComponent;
  @ViewChild(PersonDetailOverlayComponent, { read: ElementRef }) personDetailOverlayComponentRef: ElementRef;

  constructor(private teamService: TeamService) { }
  ngOnInit() {}

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }

  exportScreenshots() {
    this.personDetailOverlayComponent.data = {
      person: this.teamService.persons[0],
      onClose: () => {},
      onPreviousPersonClicked: () => {},
      onNextPersonClicked: () => {},
      onPersonClicked: (person: Person) => {},
    };

    setTimeout(() => {
      console.log(this.personDetailOverlayComponentRef);

      const options = {
        allowTaint: false,
        backgroundColor: null,
        scale: 2.0,
        useCORS: true

      };

      html2canvas(this.personDetailOverlayComponentRef.nativeElement, options).then(canvas => {
        canvas.toBlob(function(blob) {
          FileSaver.saveAs(blob, 'screenshot.png');
        });
      });
    }, 1000);
  }
}
