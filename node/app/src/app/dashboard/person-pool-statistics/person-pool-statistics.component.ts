import {Component, Input, OnInit} from '@angular/core';
import {Team} from '../../shared/models/team';
import {Skill, SkillLevel} from '../../shared/models/skill';
import {Colors} from '../../shared/constants/color.constants';
import {Device} from '../../shared/models/device';
import {Gender} from '../../shared/models/person';

@Component({
  selector: 'app-person-pool-statistics',
  templateUrl: './person-pool-statistics.component.html',
  styleUrls: ['./person-pool-statistics.component.scss']
})
export class PersonPoolStatisticsComponent implements OnInit {
  @Input() teams: Team[];

  priorityDistributionStatistics: Map<Team, number[]>;
  priorityDistributionLabels: [number, number][]; // label and space that it should take
  teamIndices: number[];

  SkillLevel = SkillLevel;
  Math = Math;
  Colors = Colors;
  Skill = Skill;
  Device = Device;
  Gender = Gender;

  constructor() { }

  ngOnInit() {
    this.updateStatistics();
  }

  public updateStatistics() {
    this.calculateTeamDistributionStatistics();
    this.teamIndices = this.teams.filter(team => team.name !== Team.OrphanTeamName).map((_, i) => i);
  }

  private calculateTeamDistributionStatistics() {
    this.priorityDistributionStatistics = new Map();
    this.teams.forEach(team =>
      this.priorityDistributionStatistics.set(
        team,
        this.teams.map((_, i) => this.getNumberOfVotesForTeamForPriority(team, i))
      )
    );

    this.priorityDistributionLabels = [[0, 0]];
    const numberOfPersons = this.getNumberOfPersons();
    const step = 10;
    for (let i = step; i < numberOfPersons; i += step)
      this.priorityDistributionLabels.push([i, step]);
    const lastStep = numberOfPersons - this.priorityDistributionLabels[this.priorityDistributionLabels.length - 1][0];
    this.priorityDistributionLabels.push([numberOfPersons, lastStep]);


    console.log(this.priorityDistributionLabels);
    console.log(this.priorityDistributionStatistics);
  }

  getNumberOfVotesForTeamForPriority(team: Team, priority: number): number {
    return this.getNumberOfPersonsWithPredicate((person) => person.teamPriorities[priority] === team);
  }

  getColorOfTeamDistributionBar(priority: number): string {
    if (priority < 3)
      return Colors.getColor(SkillLevel.High);
    else if (priority < 6)
      return Colors.getColor(SkillLevel.Medium);
    else
      return Colors.getColor(SkillLevel.Low);
  }

  getNumberOfPersonsWithSupervisorRating(skillLevel: SkillLevel): number {
    return this.getNumberOfPersonsWithPredicate((person) => person.supervisorRating === skillLevel);
  }

  getNumberOfPersons(): number {
    return this.teams.reduce((acc, team) => acc + team.persons.length, 0);
  }

  getTotalNumberOfPersonsWithMacDevice(): number {
    return this.getNumberOfPersonsWithPredicate((person) => person.devices.includes(Device.Mac));
  }

  getTotalNumberOfPersonsWithIOSDevice(): number {
    return this.getNumberOfPersonsWithPredicate((person) =>
      person.devices.includes(Device.Ipad) || person.devices.includes(Device.Iphone)
    );
  }

  getNumberOfPersonsWithGender(gender: Gender) {
    return this.getNumberOfPersonsWithPredicate((person) => person.gender === gender);
  }

  private getNumberOfPersonsWithPredicate(predicate: (Person) => boolean): number {
    return this.teams.reduce(
      (totalMatchesAcc, curTeam) => totalMatchesAcc + curTeam.persons.reduce(
        (matchesPerTeamAcc, curPerson) => matchesPerTeamAcc + (predicate(curPerson) ? 1 : 0), 0), 0);
  }
}
