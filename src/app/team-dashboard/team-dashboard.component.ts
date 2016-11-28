import {Component, OnInit} from "@angular/core";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";
import {Team} from "../shared/models/team";
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

  constructor(private teamService: TeamService){

  }

  ngOnInit(): void {
    this.teamService.readTeams().then((teams) => {
      this.teams = teams;
    });
  }
}
