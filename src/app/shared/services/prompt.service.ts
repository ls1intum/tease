import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { ApiFnRequired } from '../../api/api.service';
import { courseIterationsCourseIterationIdProjectsGet as getProjects } from '../../api/fn/projects/course-iterations-course-iteration-id-projects-get';
import { courseIterationsCourseIterationIdSkillsGet as getSkills } from '../../api/fn/skills/course-iterations-course-iteration-id-skills-get';
import { courseIterationsCourseIterationIdStudentsGet as getStudents } from '../../api/fn/students/course-iterations-course-iteration-id-students-get';
import { courseIterationsCourseIterationIdAllocationsGet as getAllocations } from '../../api/fn/allocations/course-iterations-course-iteration-id-allocations-get';
import { courseIterationsCourseIterationIdAllocationsPost as postAllocations } from 'src/app/api/fn/allocations/course-iterations-course-iteration-id-allocations-post';
import { Observable, lastValueFrom } from 'rxjs';
import { Skill, Student, Project, Allocation } from 'src/app/api/models';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  constructor(private apiService: ApiService) {}

  private async fetchValue<P, R>(fn: ApiFnRequired<P, R>): Promise<R> {
    const param: P = { courseIterationId: this.getCourseIteration() } as P;
    const values$ = this.apiService.invoke(fn, param);
    return lastValueFrom(values$);
  }

  async getProjects(): Promise<Project[]> {
    return this.fetchValue(getProjects);
  }

  async getSkills(): Promise<Skill[]> {
    return this.fetchValue(getSkills);
  }

  async getStudents(): Promise<Student[]> {
    return this.fetchValue(getStudents);
  }

  async getAllocations(): Promise<Allocation[]> {
    return this.fetchValue(getAllocations);
  }

  async postAllocations(allocations: Allocation[]): Promise<boolean> {
    const params = {
      courseIterationId: this.getCourseIteration(),
      body: allocations,
    };
    const result: Observable<StrictHttpResponse<void>> = this.apiService.invoke$Response(postAllocations, params);
    return (await lastValueFrom(result)).ok;
  }

  isImportPossible(): boolean {
    return this.getCourseIteration() !== null;
  }

  private getCourseIteration(): string | null {
    return localStorage.getItem('course-iteration');
  }
}
