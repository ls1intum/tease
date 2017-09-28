import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {OverlayComponent} from '../../overlay.service';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {ExamplePersonPropertyCsvRemotePath} from '../../shared/constants/csv.constants';

@Component({
  selector: 'app-import-overlay',
  templateUrl: './import-overlay.component.html',
  styleUrls: ['./import-overlay.component.scss']
})
export class ImportOverlayComponent implements OnInit, OverlayComponent {
  public data: { onTeamsImported: ((any) => void), overwriteWarning: boolean }; // TODO: any should be Array<Team>
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private teamService: TeamService) { }
  ngOnInit() {}

  protected openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length !== 1)return;

    this.teamService.readLocalTeamData(files[0]).then(teams => {
      this.teamService.saveTeams(teams);
      this.data.onTeamsImported(teams);
    });
  }

  public loadExampleData() {
    this.teamService.readRemoteTeamData(ExamplePersonPropertyCsvRemotePath).then(teams => {
      this.teamService.saveTeams(teams).then(saved => {
        this.data.onTeamsImported(teams);
      });
    });
  }
}
