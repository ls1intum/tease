import {Component, OnInit, ViewContainerRef, OnDestroy} from "@angular/core";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {Team} from "../../shared/models/team";
import {Router} from "@angular/router";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {PersonDetailComponent} from "../../person-details/details/person-detail.component";
import {Person} from "../../shared/models/person";
import {DragulaService} from "ng2-dragula/components/dragula.provider";
import {PersonPreviewComponent} from "../../person-list/preview/person-preview.component";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangDashbaord} from "../../shared/constants/language.constants";
import {Subscription} from "rxjs";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */


@Component({
  templateUrl: 'team-dashboard.component.html',
  styleUrls: ['team-dashboard.component.css',
    '../styles/dragula.min.css'],
  selector: 'team-dashboard',
})
export class TeamDashboardComponent implements OnInit,OnDestroy {
  private readonly EXPORT_FILE_NAME = "team_data.csv";

  private teams: Team[];
  private dialogRef: MdDialogRef<PersonDetailComponent>;
  private exportButtonSubscription: Subscription;

  constructor(private dragulaService: DragulaService,
              private router: Router,
              public dialog: MdDialog,
              public viewContainerRef: ViewContainerRef,
              private teamService: TeamService,
              private toolbarService: ToolbarService) {
    this.toolbarService.resetToDefaultValues();
    this.toolbarService.changeButtonName(LangDashbaord.ToolbarButtonName);

    dragulaService.dropModel.subscribe((value) => {
      let [bagName, el, target, source] = value;
      this.onDrop(el, target, source);
    });
  }

  onDrop(el: HTMLDivElement, target: HTMLDivElement, source) {
    // TODO find out how to mak use of these "HTMLDIVELEMENT" params

    this.updateReferences();
    this.saveAll();
  }

  private saveAll() {
    this.teamService.saveTeams(this.teams);
  }

  // TODO this is a time saving solution: optimal would be to
  // TODO ONLY update the references of the just moved element
  updateReferences() {
    this.teams.forEach(team => team.persons.forEach(person => person.team = team))
  }

  ngOnInit(): void {
    this.exportButtonSubscription = this.toolbarService.buttonClicked.subscribe(() => {
      this.exportTeams();
    });

    this.teamService.readSavedTeams().then((teams) => {
      this.teams = this.getSortedAlphabetically(teams);

      if (teams == undefined || teams.length == 0)
        this.gotoImport();
    });
  }

  private getSortedAlphabetically(teams): Team[] {
    let sortedTeams = teams.filter(team => team.name !== Team.OrphanTeamName).sort((a, b) => {
      let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
    sortedTeams.unshift(...teams.filter(team => team.name === Team.OrphanTeamName));

    return sortedTeams;
  }

  gotoImport() {
    let link = ["/import"];
    this.router.navigate(link);
  }

  onPersonDialogClosed(){
    this.saveAll();
  }

  exportTeams() {
    this.teamService.exportTeams(this.EXPORT_FILE_NAME);
  }

  ngOnDestroy(): void {
    this.exportButtonSubscription.unsubscribe();
  }
}
