import { Component, OnInit } from '@angular/core';
import {Team} from '../../shared/models/team';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';

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
  protected personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;



  constructor(private teamService: TeamService,
              private dragulaService: DragulaService) {

    /* save model when modified by drag&drop operation */
    dragulaService.dropModel.subscribe(value => {
      /* update team memberships */
      this.teams.forEach(team => team.persons.forEach(person => person.team = team));
      this.teamService.saveTeams(this.teams);
    });
  }

  ngOnInit() {
    this.teamService.readSavedTeams().then(teams => this.teams = teams);
  }

  protected getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    return `person-pool-display-mode-${PersonPoolDisplayMode[value].toLowerCase()}`;
  }
}
