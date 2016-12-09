import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {TeamService} from "../../shared/layers/business-logic-layer/services/team.service";
import {Team} from "../../shared/models/team";
import {Router} from "@angular/router";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {PersonService} from "../../shared/layers/business-logic-layer/services/person.service";
import {PersonDetailComponent} from "../../person-details/person-detail.component";
import {Person} from "../../shared/models/person";
import {DragulaService} from "ng2-dragula/components/dragula.provider";
import {PersonPreviewComponent} from "../../person-list/preview/person-preview.component";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */


@Component({
  templateUrl: 'team-dashboard.component.html',
  styleUrls: ['team-dashboard.component.css',
    '../styles/dragula.min.css'],
  selector: 'team-dashboard',
})
export class TeamDashboardComponent implements OnInit {
  private readonly EXPORT_FILE_NAME = "team_data";

  private teams: Team[];
  private dialogRef: MdDialogRef<PersonDetailComponent>;

  constructor(private dragulaService: DragulaService,
              private router: Router,
              public dialog: MdDialog,
              public viewContainerRef: ViewContainerRef,
              private teamService: TeamService) {
    dragulaService.dropModel.subscribe((value) => {
      let [bagName, el, target, source] = value;
      this.onDrop(el, target, source);
    });
  }

  onDrop(el: HTMLDivElement, target: HTMLDivElement, source) {
    // TODO find out how to mak use of these "HTMLDIVELEMENT" params

    this.updateReferences();
    this.teamService.save(this.teams);
  }

  // TODO this is a time saving solution: optimal would be to
  // TODO ONLY update the references of the just moved element
  updateReferences() {
    this.teams.forEach(team => team.persons.forEach(person => person.team = team))
  }

  ngOnInit(): void {
    this.teamService.read().then((teams) => {
      this.teams = teams;

      if (teams == undefined || teams.length == 0)
        this.gotoImport();
    });
  }

  gotoDetail(person: Person) {
    if (this.dialogRef != undefined) this.dialogRef.close();

    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    this.dialogRef = this.dialog.open(PersonDetailComponent, config);
    this.dialogRef.componentInstance.person = person;
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = undefined;
    });
  }

  gotoImport() {
    let link = ["/import"];
    this.router.navigate(link);
  }

  exportTeams() {
    this.teamService.exportTeams(this.EXPORT_FILE_NAME);
  }
}
