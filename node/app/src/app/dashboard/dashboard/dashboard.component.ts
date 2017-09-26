import { Component, OnInit } from '@angular/core';
import {Team} from '../../shared/models/team';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';
import {ExamplePersonPropertyCsvRemotePath} from '../../shared/constants/csv.constants';
import {Person} from '../../shared/models/person';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {OverlayService} from '../../overlay.service';

enum PersonPoolDisplayMode {
  Closed, OneRow, TwoRows, Full
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  protected teams: Team[];
  protected orphanTeam: Team;
  protected personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;

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
    this.teamService.readSavedTeams().then(teams => {
      this.loadTeams(teams);
    });
  }

  private loadTeams(teams: Team[]) {
    this.teams = teams.filter(team => team.name !== Team.OrphanTeamName);
    this.orphanTeam = teams.find(team => team.name === Team.OrphanTeamName);
  }

  public loadExampleData() {
    this.teamService.readRemoteTeamData(ExamplePersonPropertyCsvRemotePath).then(teams => {
      this.teamService.saveTeams(teams).then(saved => {
        this.loadTeams(teams);
      });
    });
  }

  protected getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    return `person-pool-display-mode-${PersonPoolDisplayMode[value].toLowerCase()}`;
  }

  protected showPersonDetails(person: Person) {
    this.overlayService.displayComponent(PersonDetailOverlayComponent, { person: person });
  }
}
