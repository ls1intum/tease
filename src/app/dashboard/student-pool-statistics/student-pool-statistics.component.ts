import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project';
import { Skill, SkillLevel } from '../../shared/models/skill';
import { Colors } from '../../shared/constants/color.constants';
import { Device } from '../../shared/models/device';
import { Gender } from '../../shared/models/student';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';

@Component({
  selector: 'app-student-pool-statistics',
  templateUrl: './student-pool-statistics.component.html',
  styleUrls: ['./student-pool-statistics.component.scss'],
})
export class StudentPoolStatisticsComponent implements OnInit {
  priorityDistributionStatistics: Map<Project, number[]>;
  priorityDistributionLabels: [number, number][]; // label and space that it should take
  teamIndices: number[];

  SkillLevel = SkillLevel;
  Math = Math;
  Colors = Colors;
  Skill = Skill;
  Device = Device;
  Gender = Gender;

  constructor(public teamService: TeamService) {}

  ngOnInit() {
    this.updateStatistics();
  }

  public updateStatistics() {
    this.calculateTeamDistributionStatistics();
    this.teamIndices = this.teamService.teams.map((_, i) => i);
  }

  private calculateTeamDistributionStatistics() {
    this.priorityDistributionStatistics = new Map();
    this.teamService.teams.forEach(team =>
      this.priorityDistributionStatistics.set(
        team,
        this.teamService.teams.map((_, i) => this.getNumberOfVotesForTeamForPriority(team, i))
      )
    );

    this.priorityDistributionLabels = [[0, 0]];
    const numberOfPersons = this.getNumberOfPersons();
    const step = 10;
    for (let i = step; i < numberOfPersons; i += step) this.priorityDistributionLabels.push([i, step]);
    const lastStep = numberOfPersons - this.priorityDistributionLabels[this.priorityDistributionLabels.length - 1][0];
    this.priorityDistributionLabels.push([numberOfPersons, lastStep]);

    console.log(this.priorityDistributionLabels);
    console.log(this.priorityDistributionStatistics);
  }

  getNumberOfVotesForTeamForPriority(team: Project, priority: number): number {
    return this.getNumberOfPersonsWithPredicate(person => person.teamPriorities[priority] === team);
  }

  getColorOfTeamDistributionBar(priority: number): string {
    if (priority < 3) return Colors.getColor(SkillLevel.High);
    else if (priority < 6) return Colors.getColor(SkillLevel.Medium);
    else return Colors.getColor(SkillLevel.Low);
  }

  getNumberOfPersonsWithSupervisorRating(skillLevel: SkillLevel): number {
    return this.getNumberOfPersonsWithPredicate(person => person.supervisorRating === skillLevel);
  }

  getNumberOfPersons(): number {
    return this.teamService.persons.length;
  }

  getTotalNumberOfPersonsWithMacDevice(): number {
    return this.getNumberOfPersonsWithPredicate(person => person.devices.includes(Device.Mac));
  }

  getTotalNumberOfPersonsWithIOSDevice(): number {
    return this.getNumberOfPersonsWithPredicate(
      person =>
        person.devices.includes(Device.Ipad) ||
        person.devices.includes(Device.Iphone) ||
        person.devices.includes(Device.IpadAR) ||
        person.devices.includes(Device.IphoneAR)
    );
  }

  getNumberOfPersonsWithGender(gender: Gender) {
    return this.getNumberOfPersonsWithPredicate(person => person.gender === gender);
  }

  private getNumberOfPersonsWithPredicate(predicate: (Person) => boolean): number {
    return this.teamService.persons.reduce((acc, curPerson) => acc + (predicate(curPerson) ? 1 : 0), 0);
  }
}
