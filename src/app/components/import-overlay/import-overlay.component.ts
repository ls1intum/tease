import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayComponent, OverlayService } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { ExamplePersonPropertyCsvRemotePath } from '../../shared/constants/csv.constants';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { StudentToPersonService } from 'src/app/shared/services/student-to-person.service';
import { ProjectToTeamService } from 'src/app/shared/services/project-to-team.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { StudentsService } from 'src/app/shared/data/students.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastsService } from 'src/app/shared/services/toasts.service';
import { Allocation, Project, Skill, Student } from 'src/app/api/models';
import { Team } from 'src/app/shared/models/team';
import { Person } from 'src/app/shared/models/person';
import { TeamToProjectService } from 'src/app/shared/services/team-to-project.service';
import { PersonToStudentService } from 'src/app/shared/services/person-to-student.service';
import { ConstraintsService } from 'src/app/shared/data/constraints.service';
import { IdMappingService } from 'src/app/shared/data/id-mapping.service';
import { LocksService } from 'src/app/shared/data/locks.service';

@Component({
  selector: 'app-import-overlay',
  templateUrl: './import-overlay.component.html',
  styleUrls: ['./import-overlay.component.scss'],
})
export class ImportOverlayComponent implements OverlayComponent {
  // TODO: Fix Overlay Component
  public data: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private teamService: TeamService,
    private promptService: PromptService,
    //data services
    private skillsService: SkillsService,
    private allocationsService: AllocationsService,
    private projectsService: ProjectsService,
    private studentService: StudentsService,
    private constraintsService: ConstraintsService,
    private idMappingService: IdMappingService,
    private locksService: LocksService,
    private toastsService: ToastsService,
    private teamToProjectService: TeamToProjectService,
    private personToStudentService: PersonToStudentService,
    private overlayService: OverlayService
  ) {}

  importFromCSV() {
    this.fileInput.nativeElement.click();
  }

  isImportPossible(): boolean {
    return this.promptService.isImportPossible();
  }

  async importFromPrompt(): Promise<void> {
    if (!this.isImportPossible()) {
      return;
    }

    try {
      const students = await this.promptService.getStudents();
      const projects = await this.promptService.getProjects();
      const skills = await this.promptService.getSkills();
      const allocations = await this.promptService.getAllocations();

      this.setStudentData(students, projects, skills, allocations);
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        console.log('Error while fetching data: ', error);
        this.toastsService.showToast(`Error ${error.status}: ${error.statusText}`, 'Import failed', false);
      } else {
        console.log('Unknown error: ', error);
        this.toastsService.showToast(`Unknown error`, 'Import failed', false);
      }
      return;
    }
  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length !== 1) return;

    this.teamService.readFromCSVFile(files[0]).then(() => {
      this.loadStudentData(this.teamService.teams, this.teamService.persons);
    });
  }

  public loadExampleData() {
    this.teamService.readRemoteData(ExamplePersonPropertyCsvRemotePath).then(() => {
      this.loadStudentData(this.teamService.teams, this.teamService.persons);
    });
  }

  private loadStudentData(teams: Team[], persons: Person[]): void {
    const students = this.personToStudentService.transformPersonsToStudents(persons);
    const projects = this.teamToProjectService.transformTeamsToProjects(teams);
    const allocations = this.teamToProjectService.transformTeamsToAllocations(teams);
    const skills = this.personToStudentService.transformPersonsToSkills(persons);

    this.setStudentData(students, projects, skills, allocations);
  }

  private setStudentData(students: Student[], projects: Project[], skills: Skill[], allocations: Allocation[]): void {
    this.idMappingService.deleteMapping();
    this.constraintsService.deleteConstraints();
    this.locksService.deleteLocks();
    this.studentService.setStudents(students);
    this.projectsService.setProjects(projects);
    this.skillsService.setSkills(skills);
    this.allocationsService.setAllocations(allocations);

    this.overlayService.closeOverlay();
  }
}
