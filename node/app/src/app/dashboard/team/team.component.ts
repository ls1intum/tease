import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Person} from '../../shared/models/person';
import {OverlayService} from '../../overlay.service';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {DashboardComponent} from "../dashboard/dashboard.component";
import {DashboardService} from "../dashboard.service";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input()
  team: Team;

  protected statisticsVisible = false;

  constructor(public dashboardService: DashboardService) { }

  ngOnInit() {
  }

  showPersonDetails(person: Person) {
    if(this.dashboardService.dashboard)
      this.dashboardService.dashboard.showPersonDetails(person);
  }
}
