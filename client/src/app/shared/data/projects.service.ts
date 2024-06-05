import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private projectsSubject$: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  constructor() {
    try {
      const storedProjects = localStorage.getItem('projects') || '[]';
      const projects = JSON.parse(storedProjects);
      this.setProjects(projects);
    } catch (error) {
      this.deleteProjects();
    }
  }

  setProjects(projects: Project[]): void {
    this.projectsSubject$.next(projects);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  deleteProjects(): void {
    this.setProjects([]);
  }

  getProjects(): Project[] {
    return this.projectsSubject$.getValue();
  }

  get projects$(): Observable<Project[]> {
    return this.projectsSubject$.asObservable();
  }

  getProjectNameById(id: string): string {
    const projects = this.getProjects();
    const project = projects.find(project => project.id === id);
    return project?.name;
  }
}
