/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Project } from '../models/project';
import { v2CourseIterationCourseIterationIdProjectsGet } from '../fn/projects/v-2-course-iteration-course-iteration-id-projects-get';
import { V2CourseIterationCourseIterationIdProjectsGet$Params } from '../fn/projects/v-2-course-iteration-course-iteration-id-projects-get';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `v2CourseIterationCourseIterationIdProjectsGet()` */
  static readonly V2CourseIterationCourseIterationIdProjectsGetPath = '/v2/courseIteration/{courseIterationId}/projects';

  /**
   * Retrieve projects from a specific course iteration.
   *
   * Returns projects from a course iteration based on the provided ID.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2CourseIterationCourseIterationIdProjectsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdProjectsGet$Response(params: V2CourseIterationCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Project>>> {
    return v2CourseIterationCourseIterationIdProjectsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve projects from a specific course iteration.
   *
   * Returns projects from a course iteration based on the provided ID.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `v2CourseIterationCourseIterationIdProjectsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdProjectsGet(params: V2CourseIterationCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<Array<Project>> {
    return this.v2CourseIterationCourseIterationIdProjectsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Project>>): Array<Project> => r.body)
    );
  }

}
