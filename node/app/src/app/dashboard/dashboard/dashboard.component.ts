import { Component, OnInit } from '@angular/core';
import {Team} from '../../shared/models/team';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';
import {ExamplePersonPropertyCsvRemotePath} from '../../shared/constants/csv.constants';
import {Person} from '../../shared/models/person';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {OverlayService} from '../../overlay.service';
import {ConstraintsOverlayComponent} from '../constraints-overlay/constraints-overlay.component';

enum PersonPoolDisplayMode {
  Closed, OneRow, TwoRows, Full
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  teams: Team[];
  orphanTeam: Team;
  personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;

  constructor(private teamService: TeamService,
              private dragulaService: DragulaService,
              private overlayService: OverlayService) {

    /* save model when modified by drag&drop operation */
    dragulaService.dropModel.subscribe(value => {
      /* update team memberships (reverse references) */
      const teamsWithOrphans = this.teams.concat(this.orphanTeam);
      teamsWithOrphans.forEach(team => team.persons.forEach(person => person.team = team));
      this.teamService.saveTeams(teamsWithOrphans);
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

  public loadTeams(teams: Team[]) {
    this.teams = teams.filter(team => team.name !== Team.OrphanTeamName);
    this.orphanTeam = teams.find(team => team.name === Team.OrphanTeamName);
  }

  getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    return `person-pool-display-mode-${PersonPoolDisplayMode[value].toLowerCase()}`;
  }

  protected showPersonDetails(person: Person) {
    this.overlayService.displayComponent(PersonDetailOverlayComponent, { person: person });
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
    return this.teams.reduce((acc, team) => acc && team.persons.length == 0, true);
  }
}
