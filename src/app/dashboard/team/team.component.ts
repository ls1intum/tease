import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Team } from '../../shared/models/team';
import { Person } from '../../shared/models/person';
import { StudentsService } from 'src/app/shared/data/students.service';
import { Student } from 'src/app/api/models';
import { ProjectsService } from 'src/app/shared/data/projects.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  @Input() team: Team;
  @Input() teamStatisticsButtonPressed;
  @Output() onPersonClicked = new EventEmitter<Person>();

  @Input()
  isDraggable: boolean = true;

  screenshotMode = false;

  statisticsVisible = false;

  ngOnInit() {
    if (this.teamStatisticsButtonPressed)
      this.teamStatisticsButtonPressed.subscribe(showStatistics => (this.statisticsVisible = showStatistics));
  }

  constructor(
    private studentsService: StudentsService,
    private projectsService: ProjectsService
  ) {}

  getStudentById(id: string): Student {
    return this.studentsService.getStudentById(id);
  }

  getProjectIdByName(name: string): string {
    return this.projectsService.getProjectIdByName(name);
  }
}
