import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { ExamplePersonPropertyCsvRemotePath } from '../../shared/constants/csv.constants';
import { ConstraintLoggingService } from '../../shared/layers/business-logic-layer/constraint-logging.service';

@Component({
  selector: 'app-import-overlay',
  templateUrl: './import-overlay.component.html',
  styleUrls: ['./import-overlay.component.scss'],
})
export class ImportOverlayComponent implements OnInit, OverlayComponent {
  public data: { onTeamsImported: () => void; overwriteWarning: boolean }; // TODO: any should be Array<Team>
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private teamService: TeamService) {}
  ngOnInit() {}

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length !== 1) return;

    this.teamService.readFromCSVFile(files[0]).then(teams => {
      this.data.onTeamsImported();
      ConstraintLoggingService.reset();
    });
  }

  private onImported() {
    this.data.onTeamsImported();
    ConstraintLoggingService.reset();
  }

  public loadExampleData() {
    this.teamService.readRemoteData(ExamplePersonPropertyCsvRemotePath).then(success => {
      this.onImported();
    });
  }

  public loadFromPROMPT() {
    this.teamService.readFromAPI().then(success => {
      this.onImported();
    });
  }
}
