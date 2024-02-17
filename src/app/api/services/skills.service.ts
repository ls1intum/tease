/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Skill } from '../models/skill';
import { v2CourseIterationCourseIterationIdSkillsGet } from '../fn/skills/v-2-course-iteration-course-iteration-id-skills-get';
import { V2CourseIterationCourseIterationIdSkillsGet$Params } from '../fn/skills/v-2-course-iteration-course-iteration-id-skills-get';

@Injectable({ providedIn: 'root' })
export class SkillsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `v2CourseIterationCourseIterationIdSkillsGet()` */
  static readonly V2CourseIterationCourseIterationIdSkillsGetPath = '/v2/courseIteration/{courseIterationId}/skills';

  /**
   * Retrieve the skills from a specific course iteration.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2CourseIterationCourseIterationIdSkillsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdSkillsGet$Response(params: V2CourseIterationCourseIterationIdSkillsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Skill>>> {
    return v2CourseIterationCourseIterationIdSkillsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve the skills from a specific course iteration.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `v2CourseIterationCourseIterationIdSkillsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdSkillsGet(params: V2CourseIterationCourseIterationIdSkillsGet$Params, context?: HttpContext): Observable<Array<Skill>> {
    return this.v2CourseIterationCourseIterationIdSkillsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Skill>>): Array<Skill> => r.body)
    );
  }

}
