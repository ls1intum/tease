import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Project } from 'src/app/api/models';
import { ProjectsService } from 'src/app/shared/data/projects.service';
import { SelectData } from 'src/app/shared/matching/constraints/constraint-functions/constraint-function';

@Component({
  selector: 'app-constraint-projects-builder',
  templateUrl: './constraint-projects-builder.component.html',
  styleUrl: './constraint-projects-builder.component.scss',
})
export class ConstraintProjectsBuilderComponent implements OnInit {
  private projects: Project[] = [];
  projectData: SelectData[] = [];
  selectedProjectIds: string[] = [];
  @Output() selectedProjectsChange = new EventEmitter<string[]>();

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projects = this.projectsService.getProjects();

    this.projects.forEach(project => {
      this.projectData.push({ id: project.id, name: project.name });
    });
  }

  toggleProjectsSelection(projectId: string) {
    if (this.selectedProjectIds.includes(projectId)) {
      this.selectedProjectIds = this.selectedProjectIds.filter(id => id !== projectId);
    } else {
      this.selectedProjectIds.push(projectId);
    }
    this.selectedProjectsChange.emit(this.selectedProjectIds);
  }

  toggleAllProjectsSelection() {
    if (this.selectedProjectIds.length === this.projects.length) {
      this.selectedProjectIds = [];
    } else {
      this.selectedProjectIds = this.projects.map(project => project.id);
    }
    this.selectedProjectsChange.emit(this.selectedProjectIds);
  }
}
