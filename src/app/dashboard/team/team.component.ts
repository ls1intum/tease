import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '../../shared/models/team';
import { Student } from '../../shared/models/student';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  @Input() team: Team;
  @Input() onTeamStatisticsButtonPressed;
  @Output() onStudentClicked = new EventEmitter<Student>();

  screenshotMode = false;

  statisticsVisible = false;

  constructor() {}

  ngOnInit() {
    if (this.onTeamStatisticsButtonPressed)
      this.onTeamStatisticsButtonPressed.subscribe(showStatistics => (this.statisticsVisible = showStatistics));
  }
}
