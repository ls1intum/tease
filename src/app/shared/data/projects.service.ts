import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor() {
    try {
      let projects = JSON.parse(localStorage.getItem('projects'));
      if (!projects) {
        projects = [];
      }
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

  public deleteProjects(): void {
    this.projectsSubject.next([]);
  }

  public getProjects(): Project[] {
    return this.projectsSubject.getValue();
  }
}
