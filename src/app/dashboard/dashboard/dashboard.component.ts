import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { DragulaService } from 'ng2-dragula';
import { Person } from '../../shared/models/person';
import { PersonDetailOverlayComponent } from '../person-detail-overlay/person-detail-overlay.component';
import { OverlayService } from '../../overlay.service';
import { SkillLevel } from '../../shared/models/skill';
import { Device } from '../../shared/models/device';
import { FormControl, FormGroup } from '@angular/forms';
import { Allocation, Project, Skill, Student } from 'src/app/api/models';
import { StudentsService } from 'src/app/shared/data/students.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { ImportOverlayComponent } from '../import-overlay/import-overlay.component';
import { StudentToPersonService } from 'src/app/shared/services/student-to-person.service';
import { ProjectToTeamService } from 'src/app/shared/services/project-to-team.service';

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
  statisticsVisible = false;

  PersonPoolDisplayMode = PersonPoolDisplayMode;
  SkillLevel = SkillLevel;
  Device = Device;

  personPoolDisplayModeFormGroup = new FormGroup({
    personPoolDisplayModeControl: new FormControl(this.PersonPoolDisplayMode[this.PersonPoolDisplayMode.OneRow]),
  });

  private _students: Student[];
  private _projects: Project[];
  private _skills: Skill[];
  private _allocations: Allocation[];

  studentsWithoutTeam: Student[];
  dataLoaded = false;

  constructor(
    public teamService: TeamService,
    private dragularService: DragulaService,
    private allocationsService: AllocationsService,
    private projectsService: ProjectsService,
    private skillsService: SkillsService,
    private overlayService: OverlayService,
    private studentsService: StudentsService,
    private studentPersonTransformerService: StudentToPersonService,
    private projectTeamTransformerService: ProjectToTeamService
  ) {}

  ngOnInit(): void {
    this.studentsService.students$.subscribe(students => {
      this._students = students;
      this.updateAllocationsData();
    });
    this.allocationsService.allocations$.subscribe(allocations => {
      this._allocations = allocations;
      this.updateAllocationsData();
    });
    this.projectsService.projects$.subscribe(projects => {
      this._projects = projects;
      this.updateAllocationsData();
    });
    this.skillsService.skills$.subscribe(skills => {
      this._skills = skills;
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

    this.allocationsService.moveStudentToProjectAtPosition(studentId, projectId, siblingId);
  }

  private isDataLoaded(): boolean {
    this.dataLoaded = !(
      !this._students?.length ||
      !this._projects?.length ||
      !this._skills?.length ||
      !this._allocations
    );
    this.loadPersonData(this._students, this._skills, this._projects, this._allocations);
    return this.dataLoaded;
  }

  private updateAllocationsData(): void {
    this.isDataLoaded();
    if (!this.dataLoaded) return;
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

  getStudentById(id: string): Student {
    return this.studentsService.getStudentById(id);
  }

  showImportOverlay() {
    this.overlayService.displayComponent(ImportOverlayComponent, {
      onTeamsImported: () => {
        this.overlayService.closeOverlay();
      },
      overwriteWarning: this.dataLoaded,
    });
  }

  //TODO: Remove this with person and team data
  private loadPersonData(students: Student[], skills: Skill[], projects: Project[], allocations: Allocation[]): void {
    const persons = this.studentPersonTransformerService.transformStudentsToPersons(
      students,
      skills,
      projects,
      allocations
    );
    const teams = this.projectTeamTransformerService.projectsToTeams(projects, persons);

    this.teamService.clearSavedData();
    this.teamService.load([persons, teams]);
    return;
  }
}
