import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { DragulaService } from 'ng2-dragula';
import { Person } from '../../shared/models/person';
import { PersonDetailOverlayComponent } from '../person-detail-overlay/person-detail-overlay.component';
import { OverlayService } from '../../overlay.service';
import { SkillLevel } from '../../shared/models/skill';
import { Device } from '../../shared/models/device';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/api/models';
import { StudentsService } from 'src/app/shared/data/students.service';

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
export class DashboardComponent implements OnInit, OnDestroy {
  @Output() importPressed = new EventEmitter();
  teamStatisticsButtonPressed = new EventEmitter<boolean>();
  toggleTeamStatisticsButtonState = true;

  statisticsVisible = false;

  PersonPoolDisplayMode = PersonPoolDisplayMode;
  SkillLevel = SkillLevel;
  Device = Device;

  personPoolDisplayModeFormGroup = new FormGroup({
    personPoolDisplayModeControl: new FormControl(this.PersonPoolDisplayMode[this.PersonPoolDisplayMode.OneRow]),
  });

  dragulaSubscription = new Subscription();
  constructor(
    public teamService: TeamService,
    private dragulaService: DragulaService,
    private overlayService: OverlayService,
    private studentsService: StudentsService
  ) {
    /* save model when modified by drag & drop operation */
    this.dragulaSubscription.add(
      dragulaService.dropModel('persons').subscribe(({ target, item }) => {
        const newTeam = teamService.getTeamByName(target.id);
        item.teamName = target.id;
        // if person belongs to no Team (Person Pool) newTeam is undefined
        newTeam?.add(item);
        teamService.saveToLocalBrowserStorage();
      })
    );
  }

  ngOnInit(): void {
    this.teamService.readFromBrowserStorage();
  }

  public showPersonDetails(person: Person): void {
    this.overlayService.closeOverlay();
    if (!person) {
      return;
    }

    const indexOfPerson = this.teamService.personsWithoutTeam.indexOf(person);

    this.overlayService.displayComponent(PersonDetailOverlayComponent, {
      person: person,
      team: this.teamService.getTeamByName(person.teamName),
      onClose: () => this.teamService.saveToLocalBrowserStorage(),
      onNextPersonClicked: () => this.showPersonDetails(this.teamService.personsWithoutTeam[indexOfPerson + 1]),
      onPreviousPersonClicked: () => this.showPersonDetails(this.teamService.personsWithoutTeam[indexOfPerson - 1]),
      onPersonClicked: clickedPerson => this.showPersonDetails(clickedPerson),
    });
  }

  public isDataLoaded(): boolean {
    return this.teamService.teams && this.teamService.teams.length > 0;
  }

  togglePersonPoolStatistics(): void {
    this.statisticsVisible = !this.statisticsVisible;

    if (this.statisticsVisible) {
      this.personPoolDisplayModeFormGroup.setValue({
        personPoolDisplayModeControl: this.PersonPoolDisplayMode[this.PersonPoolDisplayMode.Full],
      });
    }
  }

  hideStatistics(): void {
    if (this.statisticsVisible) this.togglePersonPoolStatistics();
  }

  ngOnDestroy(): void {
    this.dragulaSubscription?.unsubscribe();
  }

  onTeamStatisticsButtonPressed() {
    this.teamStatisticsButtonPressed.emit(this.toggleTeamStatisticsButtonState);
    this.toggleTeamStatisticsButtonState = !this.toggleTeamStatisticsButtonState;
  }

  getStudentById(id: string): Student {
    return this.studentsService.getStudentById(id);
  }
}
