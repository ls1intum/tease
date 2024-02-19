import { ApplicationRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { Person } from '../../shared/models/person';
import { PersonDetailCardComponent } from '../person-detail-card/person-detail-card.component';
import { TeamComponent } from '../team/team.component';
import { Team } from '../../shared/models/team';
import { TeamsToAllocationsService } from 'src/app/shared/services/teams-to-allocations.service';
import { PromptService } from 'src/app/shared/services/prompt.service';

@Component({
  selector: 'app-export-overlay',
  templateUrl: './export-overlay.component.html',
  styleUrls: ['./export-overlay.component.scss'],
})
export class ExportOverlayComponent implements OnDestroy, OverlayComponent {
  public data: {
    onDownloadFinished: () => void;
  };
  destroyed = false;
  imageExportRunning = false;
  imageExportProgress = 0;
  imageExportMaxProgress = 1;

  @ViewChild(PersonDetailCardComponent) personDetailCardComponent: PersonDetailCardComponent;
  @ViewChild(PersonDetailCardComponent, { read: ElementRef }) personDetailCardComponentRef: ElementRef;

  @ViewChild(TeamComponent) teamComponent: TeamComponent;
  @ViewChild(TeamComponent, { read: ElementRef }) teamComponentRef: ElementRef;

  html2canvasOptions = {
    allowTaint: false,
    backgroundColor: null,
    scale: 2.0,
    useCORS: true,
    logging: false,
  };

  constructor(
    private teamService: TeamService,
    private applicationRef: ApplicationRef,
    private teamsToAllocationsService: TeamsToAllocationsService,
    private promptService: PromptService
  ) {}

  ngOnDestroy() {
    this.destroyed = true;
  }

  public async exportPrompt() {
    const teams = this.teamService.teams;
    const allocations = this.teamsToAllocationsService.transformTeamsToAllocations(teams);
    await this.promptService.postAllocations(allocations);
  }

  exportCSV() {
    this.teamService.saveToLocalBrowserStorage().then(() => {
      this.teamService.exportSavedState();
      this.data.onDownloadFinished();
    });
  }

  getImageExportMaxProgress(onlyTeamOverview: boolean) {
    return onlyTeamOverview
      ? this.teamService.teams.reduce(acc => acc + 1, 0) + 1
      : this.teamService.teams.reduce((acc, team) => acc + 1 + team.persons.length, 0) + 1;
  }

  exportScreenshots(onlyTeamOverview: boolean) {
    this.imageExportRunning = true;
    this.imageExportProgress = 0;
    this.imageExportMaxProgress = this.getImageExportMaxProgress(onlyTeamOverview);
    let currentPromise = Promise.resolve();
    const zip = JSZip();

    this.teamService.teams.forEach(team => {
      const teamFolder = zip.folder(onlyTeamOverview ? 'Team-Overview' : team.name);

      currentPromise = currentPromise.then(
        () => {
          this.imageExportProgress++;
          return this.exportTeamScreenshot(team, teamFolder, team.name + '-0-overview.png');
        },
        () => Promise.reject(null)
      );

      if (!onlyTeamOverview) {
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
      }
    });

    currentPromise = currentPromise.then(
      () =>
        zip.generateAsync({ type: 'blob' }).then(content => {
          FileSaver.saveAs(content, 'TEASE-image-export.zip');
          this.imageExportProgress++;
          this.imageExportRunning = false;
          this.data.onDownloadFinished();
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

  exportPersonScreenshot(person: Person, zip: JSZip, filename: string): Promise<void> {
    console.log('exporting person ' + person.tumId + '...');
    return new Promise<void>((resolve, reject) => {
      if (this.destroyed) {
        reject();
        return;
      }
      this.personDetailCardComponent.person = person;

      if (this.destroyed) {
        reject();
        return;
      }

      setTimeout(
        () =>
          html2canvas(this.personDetailCardComponentRef.nativeElement, this.html2canvasOptions).then(canvas => {
            canvas.toBlob(function (blob) {
              zip.file(filename, blob);
              resolve();
            });
          }),
        500
      );
    });
  }

  exportTeamScreenshot(team: Team, zip: JSZip, filename: string): Promise<void> {
    console.log('exporting team ' + team.name + '...');
    return new Promise<void>((resolve, reject) => {
      if (this.destroyed) {
        reject();
        return;
      }

      this.teamComponent.team = team;
      this.teamComponent.screenshotMode = true;
      this.teamComponent.statisticsVisible = true;

      if (this.destroyed) {
        reject();
        return;
      }
      setTimeout(
        () =>
          html2canvas(this.teamComponentRef.nativeElement, this.html2canvasOptions).then(canvas => {
            canvas.toBlob(function (blob) {
              zip.file(filename, blob);
              resolve();
            });
          }),
        500
      );
    });
  }
}
