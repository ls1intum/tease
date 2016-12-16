import {Component, OnInit, Output, EventEmitter, ViewChild, Input, ElementRef, Renderer} from "@angular/core";
import {Person} from "../shared/models/person";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {Router} from "@angular/router";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";
import {ToolbarService} from "../shared/ui/toolbar.service";

/**
 * Created by wanur on 18/11/2016.
 */

@Component({
  templateUrl: './person-data-importer.component.html',
  styleUrls: ['./person-data-importer.component.css'],
  selector: 'person-data-importer',
})
export class PersonDataImporterComponent implements OnInit {
  private isDataAvailable = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private teamService: TeamService,
              private router: Router,
              private renderer: Renderer,
              private toolbarService: ToolbarService) {
    this.toolbarService.changeButtonName("Skip");
    this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoPersonList();
    });

    this.checkIfDataAvailable();
  }

  ngOnInit(): void {
  }

  onFileChanged(event) {
    let files = event.srcElement.files;
    if (files.length != 1)return;

    this.teamService.readCsv(files[0]).then(teams => {
      this.teamService.save(teams);

      this.gotoPersonList();
    });
  }

  onUploadClicked() {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(
      this.fileInput.nativeElement, 'dispatchEvent', [event]);
  }

  gotoPersonList() {
    let link = ["/persons"];
    this.router.navigate(link);
  }

  checkIfDataAvailable() {
    this.teamService.read().then(
      teams => {
        this.isDataAvailable = teams != undefined && teams.length != 0;
      }
    )
  }
}
