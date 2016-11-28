import {Component, OnInit} from "@angular/core";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";
import {Team} from "../shared/models/team";
import {Router} from "@angular/router";
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

  constructor(private teamService: TeamService,
  private router: Router){

  }

  ngOnInit(): void {
    this.teamService.readTeams().then((teams) => {
      this.teams = teams;

      if (teams == undefined || teams.length == 0)
        this.gotoImport();
    });
  }


  gotoImport() {
    let link = ["/import"];
    this.router.navigate(link);
  }
}
