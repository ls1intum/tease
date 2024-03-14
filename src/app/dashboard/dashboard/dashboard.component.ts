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
import { Allocation, Project, Student } from 'src/app/api/models';
import { StudentsService } from 'src/app/shared/data/students.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';

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
    private dragularService: DragulaService,
    private allocationsService: AllocationsService,
    private overlayService: OverlayService,
    private studentsService: StudentsService
  ) {}

  private _students: Student[];
  private _allocations: Allocation[];
  private _sorting: Map<string, string> = new Map<string, string>();
  studentsWithoutTeam: Student[];

  ngOnInit(): void {
    this.studentsService.students$.subscribe(students => {
      this._students = students;
      this.updateAllocationsData();
    });
    this.allocationsService.allocations$.subscribe(allocations => {
      this._allocations = allocations;
      this.updateAllocationsData();
    });
    this.dragularService.drop('STUDENTS').subscribe(({ el, target, sibling }) => {
      this.handleStudentDrop(el, target, sibling);
    });
  }

  private handleStudentDrop(el: Element, target: Element, sibling: Element): void {
    if (!el || !target) return;
    const studentId = el.children[0].id;
    const projectId = target.id;
    const siblingId = sibling?.children[0].id;

    if (!studentId) return;

    if (!projectId) {
      this.allocationsService.removeStudentFromProjects(studentId);
      return;
    }

    this.allocationsService.moveStudentToProjectAtInset(studentId, projectId, siblingId);
  }

  private updateAllocationsData(): void {
    if (!this._students || !this._allocations) return;
    const studentIdsWithTeam = this._allocations.flatMap(allocation => allocation.students);
    this.studentsWithoutTeam = this._students.filter(student => !studentIdsWithTeam.includes(student.id));
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
