import { Component, Input, OnInit } from '@angular/core';
import { Team } from '../../shared/models/team';
import { Skill} from '../../shared/models/skill';
import { SkillLevel } from 'src/app/shared/models/generated-model/skillLevel';
import { Colors } from '../../shared/constants/color.constants';
import { Device } from '../../shared/models/device';
import { Gender } from '../../shared/models/generated-model/gender';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';

@Component({
  selector: 'app-student-pool-statistics',
  templateUrl: './student-pool-statistics.component.html',
  styleUrls: ['./student-pool-statistics.component.scss'],
})
export class StudentPoolStatisticsComponent implements OnInit {
  priorityDistributionStatistics: Map<Team, number[]>;
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
    const numberOfStudents = this.getNumberOfStudents();
    const step = 10;
    for (let i = step; i < numberOfStudents; i += step) this.priorityDistributionLabels.push([i, step]);
    const lastStep = numberOfStudents - this.priorityDistributionLabels[this.priorityDistributionLabels.length - 1][0];
    this.priorityDistributionLabels.push([numberOfStudents, lastStep]);

    console.log(this.priorityDistributionLabels);
    console.log(this.priorityDistributionStatistics);
  }

  getNumberOfVotesForTeamForPriority(team: Team, priority: number): number {
    return this.getNumberOfStudentsWithPredicate(student => student.projectPriorities[priority] === team);
  }

  getColorOfTeamDistributionBar(priority: number): string {
    if (priority < 3) return Colors.getColor(SkillLevel.Advanced);
    else if (priority < 6) return Colors.getColor(SkillLevel.Intermediate);
    else return Colors.getColor(SkillLevel.Novice);
  }

  getNumberOfStudentsWithSupervisorRating(skillLevel: SkillLevel): number {
    return this.getNumberOfStudentsWithPredicate(student => student.supervisorAssessment === skillLevel);
  }

  getNumberOfStudents(): number {
    return this.teamService.students.length;
  }

  getTotalNumberOfStudentsWithMacDevice(): number {
    return this.getNumberOfStudentsWithPredicate(student => student.devices.includes(Device.Mac));
  }

  getTotalNumberOfStudentsWithIOSDevice(): number {
    return this.getNumberOfStudentsWithPredicate(
      student =>
        student.devices.includes(Device.Ipad) ||
        student.devices.includes(Device.Iphone) ||
        student.devices.includes(Device.IpadAR) ||
        student.devices.includes(Device.IphoneAR)
    );
  }

  getNumberOfStudentsWithGender(gender: Gender) {
    return this.getNumberOfStudentsWithPredicate(student => student.gender === gender);
  }

  private getNumberOfStudentsWithPredicate(predicate: (Student) => boolean): number {
    return this.teamService.students.reduce((acc, curStudent) => acc + (predicate(curStudent) ? 1 : 0), 0);
  }
}
