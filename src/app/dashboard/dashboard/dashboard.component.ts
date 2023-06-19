import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { DragulaService } from 'ng2-dragula';
import { Student } from '../../shared/models/person';
import { Team } from '../../shared/models/team';
import { PersonDetailOverlayComponent } from '../person-detail-overlay/person-detail-overlay.component';
import { OverlayService } from '../../overlay.service';
import { ConstraintsOverlayComponent } from '../constraints-overlay/constraints-overlay.component';
import { SkillLevel } from '../../shared/models/skill';
import { Device } from '../../shared/models/device';
import { FormControl, FormGroup } from '@angular/forms';

enum PersonPoolDisplayMode {
  Closed,
  OneRow,
  TwoRows,
  Full,
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() onImportPressed = new EventEmitter();
  @Input() onTeamStatisticsButtonPressed;

  personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;
  statisticsVisible = false;

  PersonPoolDisplayMode = PersonPoolDisplayMode;
  SkillLevel = SkillLevel;
  Device = Device;

  personPoolDisplayModeFormGroup = new FormGroup({
    personPoolDisplayModeControl: new FormControl(PersonPoolDisplayMode.OneRow),
  });

  constructor(
    public teamService: TeamService,
    private dragulaService: DragulaService,
    private overlayService: OverlayService,
  ) {
    /* save model when modified by drag & drop operation */
    dragulaService.dropModel("persons").subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
      let person: Student = teamService.getPersonById(item.studentId)
      let currentTeam = person.team
      currentTeam.remove(person)

      let inferredNewTeam = this.inferTeam(targetModel, person)

      // just in case the team inferred from student references is also a copy and
      // not stored in the TeamService -> match by name (worst case this returns the same reference again)
      let newTeam = teamService.getTeamByName(inferredNewTeam.name)
      newTeam.add(person)
      teamService.saveToLocalBrowserStorage()
    });
  }

  personPoolDisplayModeUpdated() {
    this.personPoolDisplayMode = this.personPoolDisplayModeFormGroup.value.personPoolDisplayModeControl;
    this.onPersonPoolDisplayModeChange()
  }

  ngOnInit() {
    this.teamService.readFromBrowserStorage();
  }

  getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    const modeString = (Object.values(PersonPoolDisplayMode)[value] as string).toLowerCase()
    return 'person-pool-display-mode-' + modeString
  }

  public showPersonDetails(person: Student) {
    this.overlayService.closeOverlay();

    if (!person) {
      return;
    }

    const indexOfPerson = this.teamService.personsWithoutTeam.indexOf(person);

    this.overlayService.displayComponent(PersonDetailOverlayComponent, {
      person: person,
      onClose: () => this.teamService.saveToLocalBrowserStorage(),
      onNextPersonClicked: () => this.showPersonDetails(this.teamService.personsWithoutTeam[indexOfPerson + 1]),
      onPreviousPersonClicked: () => this.showPersonDetails(this.teamService.personsWithoutTeam[indexOfPerson - 1]),
      onPersonClicked: clickedPerson => this.showPersonDetails(clickedPerson),
    });
  }

  public isDataLoaded(): boolean {
    return this.teamService.teams && this.teamService.teams.length > 0;
  }

  openConstraintsDialog() {
    this.overlayService.displayComponent(ConstraintsOverlayComponent, { displayWarning: !this.areAllTeamsEmpty() });
  }

  protected areAllTeamsEmpty(): boolean {
    return this.teamService.teams.reduce((acc, team) => acc && team.persons.length === 0, true);
  }

  togglePersonPoolStatistics() {
    this.statisticsVisible = !this.statisticsVisible;
    if (this.statisticsVisible) {
      this.personPoolDisplayMode = PersonPoolDisplayMode.Full;

      // make sure the value of the radio button form is updated accordingly as well
      this.personPoolDisplayModeFormGroup.setValue({ personPoolDisplayModeControl: PersonPoolDisplayMode.Full})
    }
  }

  onPersonPoolDisplayModeChange() {
    if (this.personPoolDisplayMode !== PersonPoolDisplayMode.Full && this.statisticsVisible)
      this.togglePersonPoolStatistics();
  }

  /**
  * Infers a team based on an array of members of a team, assumes any given person picked
  * from the array has the correct team set with the exception of the person passed to the function
  * This is a workaround for the fact that a person dropped into a new team will still have the team set
  * that they were dragged out from
  * @param members The members currently in the team (including the person that was just dropped)
  * @param added The person that was just added to the team and has the wrong team set
  * @returns Inferred actual team (based on members that were already in the team)
  */
  private inferTeam(members: Array<Student>, added: Student): Team {
    let teams = members.filter(member => member.studentId != added.studentId).map(member => member.team)
    let unique_teams = [... new Set(teams)]
    if (unique_teams.length > 1) {
      throw new Error("Team members had more than one unique team: " + unique_teams.map(team => team.name))
    }
    console.log("Inferred team name: " + unique_teams[0].name)
    return unique_teams[0]
  }
}
