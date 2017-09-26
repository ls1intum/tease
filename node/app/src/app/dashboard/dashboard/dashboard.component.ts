import { Component, OnInit } from '@angular/core';
import {Team} from '../../shared/models/team';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';
import {ExamplePersonPropertyCsvRemotePath} from '../../shared/constants/csv.constants';

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
              private dragulaService: DragulaService) {

    /* save model when modified by drag&drop operation */
    dragulaService.dropModel.subscribe(value => {
      /* update team memberships (reverse references) */
      this.teams.forEach(team => team.persons.forEach(person => person.team = team));
      this.orphanTeam.persons.forEach(person => person.team = this.orphanTeam);
      this.teamService.saveTeams(this.teams);
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
}
