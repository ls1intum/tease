import {Component, OnInit, ViewContainerRef} from "@angular/core";
import {Person} from "../../shared/models/person";
import {Router} from "@angular/router";
import {TeamService} from "../../shared/layers/business-logic-layer/services/team.service";
import {DialogService} from "../../shared/ui/dialog.service";
import {Team} from "../../shared/models/team";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangPersonList} from "../../shared/constants/language-constants";
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
              private dialogService: DialogService,
              private toolbarService: ToolbarService) {
    this.toolbarService.changeButtonName(LangPersonList.ToolbarButtonName);
    this.toolbarService.buttonClicked.subscribe(() => {
      this.gotoTeamGeneration();
    });
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
