import {
  Component, OnInit, Output, EventEmitter, ViewChild, Input, ElementRef, Renderer,
  OnDestroy
} from "@angular/core";
import {Router} from "@angular/router";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../shared/ui/toolbar.service";
import {LangImport} from "../shared/constants/language.constants";
import {Subscription} from "rxjs";
import {ExamplePersonPropertyCsvRemotePath} from "../shared/constants/csv.constants";

/**
 * Created by wanur on 18/11/2016.
 */

@Component({
  templateUrl: './person-data-importer.component.html',
  styleUrls: ["./person-data-importer.component.css",
    "./person-data-importer.component.scss"],
  selector: 'person-data-importer',
})
export class PersonDataImporterComponent implements OnInit,OnDestroy {
  private skipSubscription: Subscription;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private teamService: TeamService,
              private router: Router,
              private renderer: Renderer,
              private toolbarService: ToolbarService) {
    this.toolbarService.resetToDefaultValues();
    this.toolbarService.changeButtonName(LangImport.ToolbarButtonName);

    this.checkIfDataAvailable();
  }

  ngOnInit(): void {
    this.skipSubscription = this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoPersonList();
    });
  }

  ngOnDestroy(): void {
    this.skipSubscription.unsubscribe();
  }

  onFileChanged(event) {
    let files = event.srcElement.files;
    if (files.length != 1)return;

    this.teamService.readLocalTeamData(files[0]).then(teams => {
      this.teamService.saveTeams(teams);

      this.gotoPersonList();
    });
  }

  onUploadClicked() {
    let event = new MouseEvent('click', {
      "view": window,
      "bubbles": true,
      "cancelable": false
    });
    this.renderer.invokeElementMethod(
      this.fileInput.nativeElement, 'dispatchEvent', [event]);
  }

  onUseExampleClicked() {
    this.teamService.readRemoteTeamData
    (ExamplePersonPropertyCsvRemotePath).then(teams => {
      this.teamService.saveTeams(teams);

      this.gotoPersonList();
    });
  }

  gotoPersonList() {
    let link = ["/persons"];
    this.router.navigate(link);
  }

  checkIfDataAvailable() {
    this.teamService.readSavedTeams().then(
      teams => {
        this.toolbarService.setButtonVisibility(teams != undefined
          && teams.length != 0);
      }
    )
  }
}
