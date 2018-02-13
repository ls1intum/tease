import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Person} from '../../shared/models/person';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  @Input() team: Team;
  @Input() onTeamStatisticsButtonPressed;
  @Output() onPersonClicked = new EventEmitter<Person>();

  protected statisticsVisible = false;

  constructor() { }

  ngOnInit() {
    if(this.onTeamStatisticsButtonPressed)
    this.onTeamStatisticsButtonPressed.subscribe(showStatistics => this.statisticsVisible = showStatistics);
  }
}
