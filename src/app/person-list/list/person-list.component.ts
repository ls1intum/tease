import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {PersonService} from "../../shared/layers/business-logic-layer/services/person.service";
import {Person} from "../../shared/models/person";
import {Router} from "@angular/router";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {PersonDetailComponent} from "../../person-details/person-detail.component";
import {TeamService} from "../../shared/layers/business-logic-layer/services/team.service";
import {DialogService} from "../../shared/ui/dialog.service";
import {Team} from "../../shared/models/team";
/**
 * Created by wanur on 05/11/2016.
 */

@Component({
  templateUrl: 'person-list.component.html',
  styleUrls: ['person-list.component.css'],
  selector: 'person-list'
})
export class PersonListComponent implements OnInit {
  private persons: Person[];
  private teams: Team[];

  constructor(private teamService: TeamService,
              private router: Router,
              private viewContainerRef: ViewContainerRef,
              private dialogService: DialogService) {

  }

  ngOnInit(): void {
    this.teamService.read().then(
      teams => {
        this.teams = teams;
        this.persons = [].concat(...teams.map(team => team.persons));

        if (this.persons == undefined || this.persons.length == 0)
          this.gotoImport();
      }
    )
  }

  gotoTeamGeneration(){
    let link = ["/constraints"];
    this.router.navigate(link);
  }

  gotoDetail(person: Person) {
    this.dialogService.showPersonDetails(person,this.viewContainerRef).subscribe(result => {
      this.teamService.save(this.teams);
    });
  }

  gotoImport() {
    let link = ["/import"];
    this.router.navigate(link);
  }
}
