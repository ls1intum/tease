import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";
import {Team} from "../shared/models/team";
import {Router} from "@angular/router";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {PersonDetailComponent} from "../person-details/person-detail.component";
import {Person} from "../shared/models/person";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */


@Component({
  templateUrl: 'team-dashboard.component.html',
  styleUrls: ['styles/team-dashboard.component.css',
              'styles/dragula.min.css'],
  selector: 'team-dashboard'
})
export class TeamDashboardComponent implements OnInit{
  private teams: Team[];
  private dialogRef: MdDialogRef<PersonDetailComponent>;

  constructor(private personService: PersonService,
              private router: Router,
              public dialog: MdDialog,
              public viewContainerRef: ViewContainerRef,
              private teamService: TeamService) {

  }

  ngOnInit(): void {
    this.teamService.readTeams().then((teams) => {
      this.teams = teams;

      if (teams == undefined || teams.length == 0)
        this.gotoImport();
    });
  }

  gotoDetail(person: Person) {
    if(this.dialogRef != undefined)this.dialogRef.close();

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
}
