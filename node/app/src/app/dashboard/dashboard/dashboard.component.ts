import { Component, OnInit } from '@angular/core';
import {Team} from '../../shared/models/team';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';
import {ExamplePersonPropertyCsvRemotePath} from '../../shared/constants/csv.constants';
import {Person} from '../../shared/models/person';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {OverlayService} from '../../overlay.service';
import {ConstraintsOverlayComponent} from '../constraints-overlay/constraints-overlay.component';
import {DashboardService} from "../dashboard.service";

enum PersonPoolDisplayMode {
  Closed, OneRow, TwoRows, Full
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  teams: Team[]; /* teams without orphan team */
  teamIndices: number[];
  orphanTeam: Team;
  personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;
  statisticsVisible = false;

  PersonPoolDisplayMode = PersonPoolDisplayMode;

  constructor(private teamService: TeamService,
              private dragulaService: DragulaService,
              private overlayService: OverlayService,
              private dashboardService: DashboardService) {
    this.dashboardService.dashboard = this;

    /* save model when modified by drag&drop operation */
    dragulaService.dropModel.subscribe(value => {
      this.saveTeams();
    });
  }

  ngOnInit() {
    this.loadSavedTeams();
  }

  private loadSavedTeams() {
    this.teamService.readSavedTeams().then(teams => {
      this.loadTeams(teams);
    });
  }

  public resetTeamAllocation() {
    this.teams.forEach(team => {
      const persons = Array.from(team.persons);
      team.clear();
      persons.forEach(person => person.team = this.orphanTeam);
      this.orphanTeam.persons.push(...persons);
    });

    this.saveTeams();
  }

  public sortTeams() {
    this.teams.concat(this.orphanTeam).forEach(team => {
      team.persons.sort((personA, personB) =>  personB.supervisorRating - personA.supervisorRating);
    });

    this.saveTeams();
  }

  private saveTeams() {
    /* update team memberships (reverse references) */
    const teamsWithOrphans = this.teams.concat(this.orphanTeam);
    teamsWithOrphans.forEach(team => team.persons.forEach(person => person.team = team));
    this.teamService.saveTeams(teamsWithOrphans);
  }

  public loadTeams(teams: Team[]) {
    this.teams = teams.filter(team => team.name !== Team.OrphanTeamName);
    this.teamIndices = this.teams.map((_, i) => i);
    this.orphanTeam = teams.find(team => team.name === Team.OrphanTeamName);
  }

  getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    return `person-pool-display-mode-${PersonPoolDisplayMode[value].toLowerCase()}`;
  }

  public showPersonDetails(person: Person) {
    this.overlayService.closeOverlay();

    if (!person) {
      return;
    }

    this.overlayService.displayComponent(PersonDetailOverlayComponent, {
      person: person,
      onClose: () => this.saveTeams(),
      onNextPersonClicked: () => this.showPersonDetails(this.orphanTeam.persons[this.orphanTeam.persons.indexOf(person) + 1]),
      onPreviousPersonClicked: () => this.showPersonDetails(this.orphanTeam.persons[this.orphanTeam.persons.indexOf(person) - 1])});
  }

  public isDataLoaded(): boolean {
    return this.teams && this.teams.length > 0;
  }

  openConstraintsDialog() {
    this.overlayService.displayComponent(
      ConstraintsOverlayComponent,
      { onTeamsGenerated: () =>  this.loadSavedTeams(), displayWarning: !this.areAllTeamsEmpty()}
    );
  }

  protected areAllTeamsEmpty(): boolean {
    return this.teams.reduce((acc, team) => acc && team.persons.length === 0, true);
  }

  getNumberOfVotesForTeamForPriority(team: Team, priority: number): number {
    return this.teams.reduce(
      (totalMatchesAcc, curTeam) => totalMatchesAcc + curTeam.persons.reduce(
        (matchesPerTeamAcc, curPerson) => matchesPerTeamAcc + (curPerson.teamPriorities[priority] === team ? 1 : 0),
        0
      ),
      0
    );
  }

  getColorOfTeamDistributionBar(priority: number): string {
    const green = [86, 200, 86];
    const red = [216, 73, 73];
    const ratio = priority / (this.teams.length - 1);
    const color = green.map((greenComp, i) => Math.round((1 - ratio) * greenComp + ratio * red[i]));
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }
}
