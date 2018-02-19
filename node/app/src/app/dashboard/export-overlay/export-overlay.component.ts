import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
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

  constructor(private teamService: TeamService, private applicationRef: ApplicationRef) { }
  ngOnInit() {}

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }

  exportScreenshots() {
    /*
    let p = Promise.resolve(3);

    for (let i = 0; i < 2; i++) {
      p.then((value) => {
        const person = this.teamService.persons[i];

        console.log('calling export for person ', i, ' :', person.firstName);
        p = this.exportScreenshot(person);
      });
    }
    */

    this.exportScreenshot(this.teamService.persons[0])
      .then(() => this.exportScreenshot(this.teamService.persons[1]))
      .then(() => this.exportScreenshot(this.teamService.persons[2]));
  }

  exportScreenshot(person: Person): Promise<number> {
    console.log('starting export for person ', person.firstName);

    return new Promise<number>((resolve, reject) => {
      const id = () => {};

      this.personDetailOverlayComponent.data = {
        person: person,
        onClose: id,
        onPreviousPersonClicked: id,
        onNextPersonClicked: id,
        onPersonClicked: id,
      };

      this.applicationRef.tick();

      const options = {
        allowTaint: false,
        backgroundColor: null,
        scale: 2.0,
        useCORS: true,
        logging: false
      };

      html2canvas(this.personDetailOverlayComponentRef.nativeElement, options).then(canvas => {
        canvas.toBlob(function(blob) {
          FileSaver.saveAs(blob, 'screenshot.png');
          console.log('export for person ', person.firstName, ' complete');
          resolve(5);
        });
      });
    });
  }
}
