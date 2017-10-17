import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Person} from '../../shared/models/person';
import {OverlayService} from '../../overlay.service';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {DashboardComponent} from "../dashboard/dashboard.component";

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input()
  team: Team;
  @Input()
  dashboard: DashboardComponent;

  protected statisticsVisible = false;

  constructor(private overlayService: OverlayService) { }

  ngOnInit() {
  }
}
