import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { ApiFnRequired } from '../../api/api.service';
import { v2CourseIterationCourseIterationIdProjectsGet as getProjects } from '../../api/fn/projects/v-2-course-iteration-course-iteration-id-projects-get';
import { v2CourseIterationCourseIterationIdSkillsGet as getSkills } from '../../api/fn/skills/v-2-course-iteration-course-iteration-id-skills-get';
import { v2CourseIterationCourseIterationIdStudentsGet as getStudents } from '../../api/fn/students/v-2-course-iteration-course-iteration-id-students-get';
import { v2CourseIterationCourseIterationIdAllocationsGet as getAllocations } from '../../api/fn/allocations/v-2-course-iteration-course-iteration-id-allocations-get';
import { lastValueFrom } from 'rxjs';
import { Skill, Student, Project, Allocation } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  constructor(private apiService: ApiService) {}

  private async fetchValue<P, R>(fn: ApiFnRequired<P, R>, courseIterationId: string): Promise<R> {
    const param: P = { courseIterationId: courseIterationId } as P;
    const values$ = this.apiService.invoke(fn, param);
    return lastValueFrom(values$);
  }

  async getProjects(courseIterationId: string): Promise<Project[]> {
    return this.fetchValue(getProjects, courseIterationId);
  }

  async getSkills(courseIterationId: string): Promise<Skill[]> {
    return this.fetchValue(getSkills, courseIterationId);
  }

  async getStudents(courseIterationId: string): Promise<Student[]> {
    return this.fetchValue(getStudents, courseIterationId);
  }

  async getAllocations(courseIterationId: string): Promise<Allocation[]> {
    return this.fetchValue(getAllocations, courseIterationId);
  }
}
