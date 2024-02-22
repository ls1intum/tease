import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { ApiFnRequired } from '../../api/api.service';
import { v2CourseIterationCourseIterationIdProjectsGet as getProjects } from '../../api/fn/projects/v-2-course-iteration-course-iteration-id-projects-get';
import { v2CourseIterationCourseIterationIdSkillsGet as getSkills } from '../../api/fn/skills/v-2-course-iteration-course-iteration-id-skills-get';
import { v2CourseIterationCourseIterationIdStudentsGet as getStudents } from '../../api/fn/students/v-2-course-iteration-course-iteration-id-students-get';
import { v2CourseIterationCourseIterationIdAllocationsGet as getAllocations } from '../../api/fn/allocations/v-2-course-iteration-course-iteration-id-allocations-get';
import { v2CourseIterationCourseIterationIdAllocationsPost as postAllocations } from 'src/app/api/fn/allocations/v-2-course-iteration-course-iteration-id-allocations-post';
import { lastValueFrom } from 'rxjs';
import { Skill, Student, Project, Allocation } from 'src/app/api/models';

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

  async postAllocations(allocations: Allocation[]): Promise<void> {
    const params = {
      courseIterationId: this.getCourseIteration(),
      body: allocations,
    };
    return lastValueFrom(this.apiService.invoke(postAllocations, params));
  }

  isImportPossible(): boolean {
    return this.getCourseIteration() !== null;
  }

  private getCourseIteration(): string | null {
    return localStorage.getItem('course_iteration');
  }
}
