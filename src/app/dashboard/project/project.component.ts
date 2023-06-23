import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '../../shared/models/team';
import { Student } from '../../shared/models/person';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  @Input() team: Team;
  @Input() onTeamStatisticsButtonPressed;
  @Output() onPersonClicked = new EventEmitter<Student>();

  screenshotMode = false;

  statisticsVisible = false;

  constructor() {}

  ngOnInit() {
    if (this.onTeamStatisticsButtonPressed)
      this.onTeamStatisticsButtonPressed.subscribe(showStatistics => (this.statisticsVisible = showStatistics));
  }
}
