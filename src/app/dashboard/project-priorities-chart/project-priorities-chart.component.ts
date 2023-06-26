import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { ArrayHelper } from '../../shared/helpers/array.helper';
import { Team } from '../../shared/models/team';
import { StudentStatisticsService } from '../../shared/layers/business-logic-layer/student-statistics.service';
import { Colors } from '../../shared/constants/color.constants';
import { SkillLevel } from '../../shared/models/skill';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';

@Component({
  selector: 'app-project-priorities-chart',
  templateUrl: './project-priorities-chart.component.html',
  styleUrls: ['./project-priorities-chart.component.scss'],
})
export class ProjectPrioritiesChartComponent implements OnInit, DoCheck {
  @Input() team: Team;
  @Input() scale;

  priorityDistribution: number[];
  indices: number[];
  lastStudentLength: number;
  teamCount: number;
  averagePriority: number;

  constructor(private studentStatisticsService: StudentStatisticsService, private teamService: TeamService) {}

  ngOnInit(): void {
    this.updatePriorityDistribution();
  }

  ngDoCheck(): void {
    if (this.lastStudentLength !== this.team.students.length) {
      this.lastStudentLength = this.team.students.length;
      this.updatePriorityDistribution();
    }
  }

  updatePriorityDistribution() {
    this.priorityDistribution = [];

    for (let i = 0; i < this.teamService.teams.length; i++) {
      this.priorityDistribution.push(
        this.team.students.reduce((acc, student) => acc + (student.teamPriorities[i] === this.team ? 1 : 0), 0)
      );
    }

    this.indices = this.priorityDistribution.map((_, index) => index);

    this.averagePriority =
      this.priorityDistribution.reduce(
        (acc, countForPriority, priorityIndex) => acc + countForPriority * (priorityIndex + 1),
        0
      ) / this.team.students.length;

    this.averagePriority = Math.round(this.averagePriority * 100) / 100;

    this.scale = Math.ceil(this.teamService.students.length / this.teamService.teams.length);
  }

  getColorOfTeamDistributionBar(priority: number): string {
    if (priority < 3) return Colors.getColor(SkillLevel.High);
    else if (priority < 6) return Colors.getColor(SkillLevel.Medium);
    else return Colors.getColor(SkillLevel.Low);
  }
}
