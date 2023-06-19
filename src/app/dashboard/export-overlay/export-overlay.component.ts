import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { Student } from '../../shared/models/person';
import { PersonDetailCardComponent } from '../person-detail-card/person-detail-card.component';
import { TeamComponent } from '../team/team.component';
import { Team } from '../../shared/models/team';

@Component({
  selector: 'app-export-overlay',
  templateUrl: './export-overlay.component.html',
  styleUrls: ['./export-overlay.component.scss'],
})
export class ExportOverlayComponent implements OnInit, OnDestroy, OverlayComponent {
  public data: {};
  destroyed = false;
  imageExportRunning = false;
  imageExportProgress = 0;
  imageExportMaxProgress = 1;

  @ViewChild(PersonDetailCardComponent) personDetailCardComponent: PersonDetailCardComponent;
  @ViewChild(PersonDetailCardComponent, { read: ElementRef }) personDetailCardComponentRef: ElementRef;

  @ViewChild(TeamComponent) teamComponent: TeamComponent;
  @ViewChild(TeamComponent, { read: ElementRef }) teamCompomentRef: ElementRef;

  html2canvasOptions = {
    allowTaint: false,
    backgroundColor: null,
    scale: 2.0,
    useCORS: true,
    logging: false,
  };

  constructor(private teamService: TeamService, private applicationRef: ApplicationRef) {}
  ngOnInit() {}

  ngOnDestroy() {
    this.destroyed = true;
  }

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(success => {
      this.teamService.exportSavedState();
    });
  }

  exportScreenshots() {
    this.imageExportRunning = true;
    this.imageExportProgress = 0;
    this.imageExportMaxProgress = this.teamService.teams.reduce((acc, team) => acc + 1 + team.persons.length, 0) + 1;
    let currentPromise = Promise.resolve();
    const zip = JSZip();

    this.teamService.teams.forEach(team => {
      const teamFolder = zip.folder(team.name);

      currentPromise = currentPromise.then(
        () => {
          this.imageExportProgress++;
          return this.exportTeamScreenshot(team, teamFolder, team.name + '-0-overview.png');
        },
        () => Promise.reject(null)
      );

      team.persons.forEach(
        (person, i) =>
          (currentPromise = currentPromise.then(
            () => {
              this.imageExportProgress++;
              return this.exportPersonScreenshot(person, teamFolder, team.name + '-' + (i + 1) + '.png');
            },
            () => Promise.reject(null)
          ))
      );
    });

    currentPromise = currentPromise.then(
      () =>
        zip.generateAsync({ type: 'blob' }).then(content => {
          FileSaver.saveAs(content, 'TEASE-image-export.zip');
          this.imageExportProgress++;
          this.imageExportRunning = false;
        }),
      () => {
        console.log('export cancelled');
        this.imageExportRunning = false;
      }
    );
  }

  getImageExportProgressPercentage(): number {
    return (this.imageExportProgress / this.imageExportMaxProgress) * 100;
  }

  exportPersonScreenshot(person: Student, zip: JSZip, filename: string): Promise<void> {
    console.log('exporting person ' + person.studentId + '...');
    return new Promise<void>((resolve, reject) => {
      if (this.destroyed) {
        reject();
        return;
      }

      this.personDetailCardComponent.person = person;
      this.applicationRef.tick();

      if (this.destroyed) {
        reject();
        return;
      }

      html2canvas(this.personDetailCardComponentRef.nativeElement, this.html2canvasOptions).then(canvas => {
        canvas.toBlob(function (blob) {
          zip.file(filename, blob);
          resolve();
        });
      });
    });
  }

  exportTeamScreenshot(team: Team, zip: JSZip, filename: string): Promise<void> {
    console.log('exporting team ' + team.name + '...');
    return new Promise<void>((resolve, reject) => {
      if (this.destroyed) {
        reject();
        return;
      }

      this.teamComponent.screenshotMode = true;
      this.teamComponent.statisticsVisible = true;
      this.teamComponent.team = team;
      this.applicationRef.tick();

      if (this.destroyed) {
        reject();
        return;
      }

      html2canvas(this.teamCompomentRef.nativeElement, this.html2canvasOptions).then(canvas => {
        canvas.toBlob(function (blob) {
          zip.file(filename, blob);
          resolve();
        });
      });
    });
  }
}
