import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import * as html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {Person} from '../../shared/models/person';
import {PersonDetailCardComponent} from "../person-detail-card/person-detail-card.component";

@Component({
  selector: 'app-export-overlay',
  templateUrl: './export-overlay.component.html',
  styleUrls: ['./export-overlay.component.scss']
})
export class ExportOverlayComponent implements OnInit, OverlayComponent {
  public data: {};

  @ViewChild(PersonDetailCardComponent) personDetailCardComponent: PersonDetailCardComponent;
  @ViewChild(PersonDetailCardComponent, { read: ElementRef }) personDetailCardComponentRef: ElementRef;

  constructor(private teamService: TeamService, private applicationRef: ApplicationRef) { }
  ngOnInit() {}

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }

  exportScreenshots() {
    let currentPromise = Promise.resolve();

    for (let i = 0; i < 3; i++) {
      currentPromise = currentPromise.then(() => this.exportScreenshot(this.teamService.persons[i]));
    }


  }

  exportScreenshot(person: Person): Promise<void> {
    console.log('starting export for person ', person.firstName);

    return new Promise<void>((resolve, reject) => {
      this.personDetailCardComponent.person = person;
      this.applicationRef.tick();

      const options = {
        allowTaint: false,
        backgroundColor: null,
        scale: 2.0,
        useCORS: true,
        logging: false
      };

      html2canvas(this.personDetailCardComponentRef.nativeElement, options).then(canvas => {
        canvas.toBlob(function(blob) {
          FileSaver.saveAs(blob, 'screenshot.png');
          console.log('export for person ', person.firstName, ' complete');
          this.personDetailCardComponent.person = person;
          resolve();
        });
      });
    });
  }
}
