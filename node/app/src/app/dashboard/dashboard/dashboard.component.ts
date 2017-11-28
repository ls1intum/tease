import { Component, OnInit } from '@angular/core';
import {Team} from '../../shared/models/team';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';
import {ExamplePersonPropertyCsvRemotePath} from '../../shared/constants/csv.constants';
import {Gender, Person} from '../../shared/models/person';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {OverlayService} from '../../overlay.service';
import {ConstraintsOverlayComponent} from '../constraints-overlay/constraints-overlay.component';
import {DashboardService} from '../dashboard.service';
import {Skill, SkillLevel} from '../../shared/models/skill';
import {Colors} from '../../shared/constants/color.constants';
import {Device} from '../../shared/models/device';

enum PersonPoolDisplayMode {
  Closed, OneRow, TwoRows, Full
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  teams: Team[];
  /* teams without orphan team */
  teamIndices: number[];
  orphanTeam: Team;
  personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;
  statisticsVisible = false;
  priorityDistributionStatistics: Map<Team, number[]>;
  priorityDistributionLabels: [number, number][]; // label and space that it should take

  PersonPoolDisplayMode = PersonPoolDisplayMode;
  SkillLevel = SkillLevel;
  Math = Math;
  Colors = Colors;
  Skill = Skill;
  console = console;
  Device = Device;
  Gender = Gender;

  constructor(private teamService: TeamService,
              private dragulaService: DragulaService,
              private overlayService: OverlayService,
              private dashboardService: DashboardService) {
    this.dashboardService.dashboard = this;

    /* save model when modified by drag&drop operation */
    dragulaService.dropModel.subscribe(value => {
      this.saveTeams();
    });
  }

  ngOnInit() {
    this.loadSavedTeams();
  }

  private loadSavedTeams() {
    this.teamService.readSavedTeams().then(teams => {
      this.loadTeams(teams);
    });
  }

  public resetTeamAllocation() {
    this.teams.forEach(team => {
      const persons = Array.from(team.persons);
      team.clear();
      persons.forEach(person => person.team = this.orphanTeam);
      this.orphanTeam.persons.push(...persons);
    });

    this.saveTeams();
  }

  public sortTeams() {
    this.teams.concat(this.orphanTeam).forEach(team => {
      team.persons.sort((personA, personB) => personB.supervisorRating - personA.supervisorRating);
    });

    this.saveTeams();
  }

  private saveTeams() {
    /* update team memberships (reverse references) */
    const teamsWithOrphans = this.teams.concat(this.orphanTeam);
    teamsWithOrphans.forEach(team => team.persons.forEach(person => person.team = team));
    this.teamService.saveTeams(teamsWithOrphans);
  }

  public loadTeams(teams: Team[]) {
    this.teams = teams.filter(team => team.name !== Team.OrphanTeamName);
    this.teamIndices = this.teams.map((_, i) => i);
    this.orphanTeam = teams.find(team => team.name === Team.OrphanTeamName);
    this.calculateTeamDistributionStatistics();
  }

  getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    return `person-pool-display-mode-${PersonPoolDisplayMode[value].toLowerCase()}`;
  }

  public showPersonDetails(person: Person) {
    this.overlayService.closeOverlay();

    if (!person) {
      return;
    }

    this.overlayService.displayComponent(PersonDetailOverlayComponent, {
      person: person,
      onClose: () => this.saveTeams(),
      onNextPersonClicked: () => this.showPersonDetails(this.orphanTeam.persons[this.orphanTeam.persons.indexOf(person) + 1]),
      onPreviousPersonClicked: () => this.showPersonDetails(this.orphanTeam.persons[this.orphanTeam.persons.indexOf(person) - 1])
    });
  }

  public isDataLoaded(): boolean {
    return this.teams && this.teams.length > 0;
  }

  openConstraintsDialog() {
    this.overlayService.displayComponent(
      ConstraintsOverlayComponent,
      {onTeamsGenerated: () => this.loadSavedTeams(), displayWarning: !this.areAllTeamsEmpty()}
    );
  }

  protected areAllTeamsEmpty(): boolean {
    return this.teams.reduce((acc, team) => acc && team.persons.length === 0, true);
  }

  private calculateTeamDistributionStatistics() {
    const teams = this.teams.concat(this.orphanTeam);
    this.priorityDistributionStatistics = new Map();
    teams.forEach(team =>
      this.priorityDistributionStatistics.set(
        team,
        this.teams.map((_, i) => this.getNumberOfVotesForTeamForPriority(team, i))
      )
    );

    this.priorityDistributionLabels = [[0, 0]];
    const numberOfPersons = teams.reduce((acc, team) => acc + team.persons.length, 0);
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

  togglePersonPoolStatistics() {
    this.statisticsVisible = !this.statisticsVisible;
    if (this.statisticsVisible)
      this.personPoolDisplayMode = PersonPoolDisplayMode.Full;
  }

  getColorOfTeamDistributionBar(priority: number): string {
    /*
    // the following code fades between green and red
    const green = [117, 190, 117];
    const red = [209, 111, 111];
    const ratio = priority / (this.teams.length - 1);
    const color = green.map((greenComp, i) => Math.round((1 - ratio) * greenComp + ratio * red[i]));
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    */

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
    return this.teams.concat(this.orphanTeam).reduce((acc, team) => acc + team.persons.length, 0);
  }

  onPersonPoolDisplayModeChange() {
    if (this.personPoolDisplayMode !== PersonPoolDisplayMode.Full && this.statisticsVisible)
      this.togglePersonPoolStatistics();
  }

  getTotalNumberOfDeviceType(device: Device): number {
    return this.getNumberOfPersonsWithPredicate((person) => person.devices.includes(device));
  }

  getNumberOfPersonsWithGender(gender: Gender) {
    return this.getNumberOfPersonsWithPredicate((person) => person.gender === gender);
  }

  private getNumberOfPersonsWithPredicate(predicate: (Person) => boolean): number {
    return this.teams.concat(this.orphanTeam).reduce(
      (totalMatchesAcc, curTeam) => totalMatchesAcc + curTeam.persons.reduce(
        (matchesPerTeamAcc, curPerson) => matchesPerTeamAcc + (predicate(curPerson) ? 1 : 0), 0), 0);
  }
}
