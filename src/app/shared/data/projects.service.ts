import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor() {
    try {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      this.projectsSubject.next(projects);
    } catch (error) {
      this.projectsSubject.next([]);
    }

    this.projectsSubject.subscribe(projects => {
      localStorage.setItem('projects', JSON.stringify(projects));
    });
  }

  private projectsSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  setProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
  }

  deleteProjects(): void {
    this.projectsSubject.next([]);
  }

  getProjects(): Project[] {
    return this.projectsSubject.getValue();
  }

  // TODO: Delete after removing person and team code
  getProjectIdByName(name: string): string {
    const projects = this.projectsSubject.getValue();
    const project = projects.find(project => project.name === name);
    return project ? project.id : '';
  }
}
