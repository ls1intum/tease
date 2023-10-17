import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Team } from '../../shared/models/team';
import { PersonStatisticsService } from '../../shared/layers/business-logic-layer/person-statistics.service';
import { Colors } from '../../shared/constants/color.constants';
import { SkillLevel } from '../../shared/models/skill';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';

@Component({
  selector: 'app-team-priorities-chart',
  templateUrl: './team-priorities-chart.component.html',
  styleUrls: ['./team-priorities-chart.component.scss'],
})
export class TeamPrioritiesChartComponent implements OnInit, DoCheck {
  @Input() team: Team;
  @Input() scale;

  priorityDistribution: number[];
  indices: number[];
  lastPersonLength: number;
  averagePriority: number;

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.updatePriorityDistribution();
  }

  ngDoCheck(): void {
    if (this.lastPersonLength !== this.team.persons.length) {
      this.lastPersonLength = this.team.persons.length;
      this.updatePriorityDistribution();
    }
  }

  updatePriorityDistribution() {
    this.priorityDistribution = [];

    for (let i = 0; i < this.teamService.teams.length; i++) {
      this.priorityDistribution.push(
        this.team.persons.reduce((acc, person) => acc + (person.teamPriorities[i] === this.team.name ? 1 : 0), 0)
      );
    }

    this.indices = this.priorityDistribution.map((_, index) => index);

    this.averagePriority =
      this.priorityDistribution.reduce(
        (acc, countForPriority, priorityIndex) => acc + countForPriority * (priorityIndex + 1),
        0
      ) / this.team.persons.length;

    this.averagePriority = Math.round(this.averagePriority * 100) / 100;

    this.scale = Math.ceil(this.teamService.persons.length / this.teamService.teams.length);
  }

  getColorOfTeamDistributionBar(priority: number): string {
    if (priority < 3) return Colors.getColor(SkillLevel.High);
    else if (priority < 6) return Colors.getColor(SkillLevel.Medium);
    else return Colors.getColor(SkillLevel.Low);
  }
}
