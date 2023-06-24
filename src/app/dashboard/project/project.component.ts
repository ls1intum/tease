import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Project } from '../../shared/models/project';
import { Student } from '../../shared/models/student';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  @Input() team: Project;
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
