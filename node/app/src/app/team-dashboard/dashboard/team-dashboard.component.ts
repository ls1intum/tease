import {Component, OnInit, ViewContainerRef, OnDestroy} from "@angular/core";
import {TeamService} from "../../shared/layers/business-logic-layer/team.service";
import {Team} from "../../shared/models/team";
import {MdDialog, MdDialogRef, MdDialogConfig} from "@angular/material";
import {DragulaService} from "ng2-dragula/components/dragula.provider";
import {ToolbarService} from "../../shared/ui/toolbar.service";
import {LangDashbaord} from "../../shared/constants/language.constants";
import {Subscription} from "rxjs";
import {TeamHelper} from "../../shared/helpers/team.helper";
import {PersonDetailComponent} from "../person-details/person-detail.component";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */


@Component({
  templateUrl: 'team-dashboard.component.html',
  styleUrls: [
    './team-dashboard.component.scss',
    '../styles/dragula.min.css'
  ],
  selector: 'team-dashboard',
})
export class TeamDashboardComponent implements OnInit, OnDestroy {

  private teams: Team[];
  private dialogRef: MdDialogRef<PersonDetailComponent>;
  private exportButtonSubscription: Subscription;

  constructor(private dragulaService: DragulaService,
              public dialog: MdDialog,
              public viewContainerRef: ViewContainerRef,
              private teamService: TeamService,
              private toolbarService: ToolbarService) {
    this.toolbarService.resetToDefaultValues();
    this.toolbarService.changeButtonName(LangDashbaord.ToolbarButtonName);
    this.toolbarService.setScoreVisible(true);

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

  private calculateAllocationScore(teams: Team[]): number {

    let totalScore = 0;

    let persons = TeamHelper.getPersons(teams);
    let realTeams = teams.filter(team => team.name !== Team.OrphanTeamName);

    for (let i = 0; i < persons.length; i++) {
      let person = persons[i];
      let teamName = person.team.name;

      // Assuming teams are sorted decreasingly in preference
      let priority = person.teamPriorities
        .map(x => x.name)
        .indexOf(teamName);

      if (priority === -1) {
        // something's wrong with the assignment: either this person is assigned to an orphan team or unassigned whatsoever
        totalScore = 0;
        break;
      } else {
        let score = realTeams.length - priority;
        totalScore += score;
      }
    }

    return totalScore;
  }

  ngOnInit(): void {


    this.teamService.readSavedTeams().then(teams => {
      this.teams = this.getSortedAlphabetically(teams);

      if (teams == undefined || teams.length == 0) {
        //this.gotoImport();
      }

      let totalScore = this.calculateAllocationScore(teams);
      this.toolbarService.setTotalScore(totalScore);
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

  onPersonDialogClosed() {
    this.saveAll();
  }

  ngOnDestroy(): void {
    this.exportButtonSubscription.unsubscribe();
  }
}
