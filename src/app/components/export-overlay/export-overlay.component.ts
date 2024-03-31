import { ApplicationRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { Person } from '../../shared/models/person';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { saveAs } from 'file-saver';
import { Allocation } from 'src/app/api/models';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { StudentsService } from 'src/app/shared/data/students.service';

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

  html2canvasOptions = {
    allowTaint: false,
    backgroundColor: null,
    scale: 2.0,
    useCORS: true,
    logging: false,
  };

  private readonly EXPORT_FILE_NAME = 'TEASE-mappings.csv';
  private readonly EXPORT_DATA_TYPE = 'text/csv;charset=utf-8';

  constructor(
    private teamService: TeamService,
    private applicationRef: ApplicationRef,
    private promptService: PromptService,
    private toastsService: ToastsService,
    private allocationsService: AllocationsService,
    private projectsService: ProjectsService,
    private studentsService: StudentsService
  ) {}

  ngOnDestroy() {
    this.destroyed = true;
  }

  async exportPrompt() {
    const allocations = this.allocationsService.getAllocations();
    try {
      if (await this.promptService.postAllocations(allocations)) {
        this.toastsService.showToast('Export successful', 'Export', true);
      } else {
        this.toastsService.showToast('Export failed', 'Export', false);
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log('Error while fetching data: ', error);
        this.toastsService.showToast(`Error ${error.status}: ${error.statusText}`, 'Export failed', false);
      } else {
        console.log('Unknown error: ', error);
      }
    }
  }

  exportCSV() {
    const allocations = this.allocationsService.getAllocations();
    const csvData = this.allocationsToCSV(allocations);
    const blob = new Blob([csvData], { type: this.EXPORT_DATA_TYPE });
    saveAs(blob, this.EXPORT_FILE_NAME);
  }

  private allocationsToCSV(allocations: Allocation[]): string {
    let csvData = 'Username,Team\n';
    allocations.forEach(allocation => {
      const projectName = this.projectsService.getProjectNameById(allocation.projectId);
      allocation.students.forEach(studentId => {
        const student = this.studentsService.getStudentById(studentId);
        const studentName = `${student.firstName} ${student.lastName}`;
        csvData += `${studentName},${projectName}\n`;
      });
    });
    return csvData;
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
          // return this.exportTeamScreenshot(team, teamFolder, team.name + '-0-overview.png');
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
      //this.personDetailCardComponent.person = person;

      if (this.destroyed) {
        reject();
        return;
      }

      // setTimeout(
      //   () =>
      //     html2canvas(this.personDetailCardComponentRef.nativeElement, this.html2canvasOptions).then(canvas => {
      //       canvas.toBlob(function (blob) {
      //         zip.file(filename, blob);
      //         resolve();
      //       });
      //     }),
      //   500
      // );
    });
  }

  // exportTeamScreenshot(team: Team, zip: JSZip, filename: string): Promise<void> {
  //   console.log('exporting team ' + team.name + '...');
  //   return new Promise<void>((resolve, reject) => {
  //     if (this.destroyed) {
  //       reject();
  //       return;
  //     }

  //     this.teamComponent.team = team;
  //     this.teamComponent.screenshotMode = true;
  //     this.teamComponent.statisticsVisible = true;

  //     if (this.destroyed) {
  //       reject();
  //       return;
  //     }
  //     setTimeout(
  //       () =>
  //         html2canvas(this.teamComponentRef.nativeElement, this.html2canvasOptions).then(canvas => {
  //           canvas.toBlob(function (blob) {
  //             zip.file(filename, blob);
  //             resolve();
  //           });
  //         }),
  //       500
  //     );
  //   });
  // }
}
