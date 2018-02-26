import {ApplicationRef, ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import * as html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import {Person} from '../../shared/models/person';
import {PersonDetailCardComponent} from '../person-detail-card/person-detail-card.component';
import {TeamComponent} from '../team/team.component';
import {Team} from '../../shared/models/team';

@Component({
  selector: 'app-export-overlay',
  templateUrl: './export-overlay.component.html',
  styleUrls: ['./export-overlay.component.scss']
})
export class ExportOverlayComponent implements OnInit, OverlayComponent {
  public data: {};

  @ViewChild(PersonDetailCardComponent) personDetailCardComponent: PersonDetailCardComponent;
  @ViewChild(PersonDetailCardComponent, { read: ElementRef }) personDetailCardComponentRef: ElementRef;

  @ViewChild(TeamComponent) teamComponent: TeamComponent;
  @ViewChild(TeamComponent, { read: ElementRef }) teamCompomentRef: ElementRef;

  html2canvasOptions = {
    allowTaint: false,
    backgroundColor: null,
    scale: 2.0,
    useCORS: true,
    logging: false
  };

  constructor(private teamService: TeamService, private applicationRef: ApplicationRef) { }
  ngOnInit() {}

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }

  exportScreenshots() {
    let currentPromise = Promise.resolve();

    const zip = JSZip();

    for (let i = 0; i < 10; i++) {
      currentPromise = currentPromise.then(() => this.exportPersonScreenshot(this.teamService.persons[i], zip));
    }

    /*
    this.teamService.persons.forEach((person) => {
      currentPromise = currentPromise.then(() => this.exportScreenshot(person, zip));
    });
    */

    this.teamService.teams.forEach((team) => {
      currentPromise = currentPromise.then(() => this.exportTeamScreenshot(team, zip));
    });

    currentPromise.then(() => {
      zip.generateAsync({ type: 'blob' } )
        .then(function (content) {
          FileSaver.saveAs(content, 'TEASE-image-export.zip');
        });
    });
  }

  exportPersonScreenshot(person: Person, zip: JSZip): Promise<void> {
    console.log('exporting person ' + person.tumId + '...');
    return new Promise<void>((resolve, reject) => {
      this.personDetailCardComponent.person = person;
      this.applicationRef.tick();

      html2canvas(this.personDetailCardComponentRef.nativeElement, this.html2canvasOptions).then(canvas => {
        canvas.toBlob(function(blob) {
          zip.file('person-' + person.tumId + '.png', blob);
          resolve();
        });
      });
    });
  }

  exportTeamScreenshot(team: Team, zip: JSZip): Promise<void> {
    console.log('exporting team ' + team.name + '...');
    return new Promise<void>((resolve, reject) => {
      this.teamComponent.team = team;
      this.applicationRef.tick();

      html2canvas(this.teamCompomentRef.nativeElement, this.html2canvasOptions).then(canvas => {
        canvas.toBlob(function(blob) {
          zip.file('team-' + team.name + '.png', blob);
          resolve();
        });
      });
    });
  }

  /*
  static getTimeString(): string {
    const date = new Date();
    return date.getFullYear()
      + '-' + date.getMonth()
      + '-' + date.getDay()
      + '-' + date.getHours()
      + '-' +  date.getMinutes()
      + '-' + date.getSeconds();
  }
  */
}
