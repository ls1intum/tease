import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { ExamplePersonPropertyCsvRemotePath } from '../../shared/constants/csv.constants';
import { ConstraintLoggingService } from '../../shared/layers/business-logic-layer/constraint-logging.service';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { StudentPersonTransformerService } from 'src/app/shared/services/student-to-person.service';
import { ProjectTeamTransformerService } from 'src/app/shared/services/project-to-team.service';
import { SkillsService } from 'src/app/shared/data/skills.service';
import { AllocationsService } from 'src/app/shared/data/allocations.service';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { StudentsService } from 'src/app/shared/data/students.service';

@Component({
  selector: 'app-import-overlay',
  templateUrl: './import-overlay.component.html',
  styleUrls: ['./import-overlay.component.scss'],
})
export class ImportOverlayComponent implements OverlayComponent {
  public data: { onTeamsImported: () => void; overwriteWarning: boolean }; // TODO: any should be Array<Team>
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private teamService: TeamService,
    private promptService: PromptService,
    private studentPersonTransformerService: StudentPersonTransformerService,
    private projectTeamTransformerService: ProjectTeamTransformerService,
    private skillsService: SkillsService,
    private allocationsService: AllocationsService,
    private projectsService: ProjectsService,
    private studentService: StudentsService
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

    const students = await this.promptService.getStudents();
    const projects = await this.promptService.getProjects();
    const skills = await this.promptService.getSkills();
    const allocations = await this.promptService.getAllocations();

    this.studentService.setStudents(students);
    this.projectsService.setProjects(projects);
    this.skillsService.setSkills(skills);
    this.allocationsService.setAllocations(allocations);

    // this.allocationsService.addStudentToProject('tum_id_1', 'ios23ihaus');

    const persons = this.studentPersonTransformerService.transformStudentsToPersons(
      students,
      skills,
      projects,
      allocations
    );
    const teams = this.projectTeamTransformerService.projectsToTeams(projects, persons);

    this.teamService.clearSavedData();
    this.teamService.load([persons, teams]);

    ConstraintLoggingService.reset();
    this.data.onTeamsImported();
  }

  onFileChanged(event) {
    const files = event.target.files;
    if (files.length !== 1) return;

    this.teamService.readFromCSVFile(files[0]).then(() => {
      this.data.onTeamsImported();
      ConstraintLoggingService.reset();
    });
  }

  public loadExampleData() {
    this.teamService.readRemoteData(ExamplePersonPropertyCsvRemotePath).then(() => {
      this.data.onTeamsImported();
      ConstraintLoggingService.reset();
    });
  }
}
