import {Component} from "@angular/core";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */


@Component({
  templateUrl: 'team-dashboard.component.html',
  styleUrls: ['team-dashboard.component.css'],
  selector: 'team-dashboard'
})
export class TeamDashboardComponent {
  constructor(private teamService: TeamService){

  }


}
