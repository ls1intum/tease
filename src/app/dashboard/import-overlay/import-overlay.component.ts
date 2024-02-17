import { Component, ElementRef, ViewChild } from '@angular/core';
import { OverlayComponent } from '../../overlay.service';
import { TeamService } from '../../shared/layers/business-logic-layer/team.service';
import { ExamplePersonPropertyCsvRemotePath } from '../../shared/constants/csv.constants';
import { ConstraintLoggingService } from '../../shared/layers/business-logic-layer/constraint-logging.service';
import { PromptService } from 'src/app/shared/services/prompt.service';
import { StudentPersonTransformerService } from 'src/app/shared/services/student-person-transformer.service';
import { AuthInterceptor } from 'src/app/shared/interceptors/auth.interceptor';
import { ProjectTeamTransformerService } from 'src/app/shared/services/project-team-transformer.service';

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
    private authInterceptor: AuthInterceptor
  ) {}

  importFromCSV() {
    this.fileInput.nativeElement.click();
  }

  isPromptImportAvailable(): boolean {
    return this.getJwtToken() !== null && this.getCourseIteration() !== null;
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getCourseIteration(): string | null {
    return localStorage.getItem('course_iteration');
  }

  async importFromPrompt(): Promise<void> {
    const courseIterationId = this.getCourseIteration();
    const jwtToken = this.getJwtToken();
    if (!courseIterationId || !jwtToken) {
      console.log('Course iteration or jwt token not set');
      return;
    }
    this.teamService.clearSavedData();
    ConstraintLoggingService.reset();

    this.authInterceptor.setAccessToken(jwtToken);

    const students = await this.promptService.getStudents(courseIterationId);
    const projects = await this.promptService.getProjects(courseIterationId);
    const skills = await this.promptService.getSkills(courseIterationId);
    const allocations = await this.promptService.getAllocations(courseIterationId);

    const persons = this.studentPersonTransformerService.transformStudentsToPersons(
      students,
      skills,
      projects,
      allocations
    );

    const teams = this.projectTeamTransformerService.projectsToTeams(projects, persons);

    this.teamService.load([persons, teams]);

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
