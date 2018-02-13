import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TeamService} from '../../shared/layers/business-logic-layer/team.service';
import {DragulaService} from 'ng2-dragula';
import {Person} from '../../shared/models/person';
import {PersonDetailOverlayComponent} from '../person-detail-overlay/person-detail-overlay.component';
import {OverlayService} from '../../overlay.service';
import {ConstraintsOverlayComponent} from '../constraints-overlay/constraints-overlay.component';
import {SkillLevel} from '../../shared/models/skill';
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
  @Output() onImportPressed = new EventEmitter();

  personPoolDisplayMode: PersonPoolDisplayMode = PersonPoolDisplayMode.OneRow;
  statisticsVisible = false;

  PersonPoolDisplayMode = PersonPoolDisplayMode;
  SkillLevel = SkillLevel;
  Device = Device;

  constructor(public teamService: TeamService,
              private dragulaService: DragulaService,
              private overlayService: OverlayService) {

    /* save model when modified by drag&drop operation */
    dragulaService.dropModel.subscribe(value => {
      teamService.saveToLocalBrowserStorage();
    });
  }

  ngOnInit() {
    this.teamService.readFromBrowserStorage();
  }

  getPersonPoolDisplayModeCSSClass(value: PersonPoolDisplayMode): string {
    return `person-pool-display-mode-${PersonPoolDisplayMode[value].toLowerCase()}`;
  }

  public showPersonDetails(person: Person) {
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
      onPersonClicked: clickedPerson => this.showPersonDetails(clickedPerson)
    });
  }

  public isDataLoaded(): boolean {
    return this.teamService.teams && this.teamService.teams.length > 0;
  }

  openConstraintsDialog() {
    this.overlayService.displayComponent(
      ConstraintsOverlayComponent,
      { displayWarning: !this.areAllTeamsEmpty() }
    );
  }

  protected areAllTeamsEmpty(): boolean {
    return this.teamService.teams.reduce((acc, team) => acc && team.persons.length === 0, true);
  }

  togglePersonPoolStatistics() {
    this.statisticsVisible = !this.statisticsVisible;
    if (this.statisticsVisible)
      this.personPoolDisplayMode = PersonPoolDisplayMode.Full;
  }

  onPersonPoolDisplayModeChange() {
    if (this.personPoolDisplayMode !== PersonPoolDisplayMode.Full && this.statisticsVisible)
      this.togglePersonPoolStatistics();
  }
}
