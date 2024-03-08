/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { courseIterationsCourseIterationIdProjectsGet } from '../fn/projects/course-iterations-course-iteration-id-projects-get';
import { CourseIterationsCourseIterationIdProjectsGet$Params } from '../fn/projects/course-iterations-course-iteration-id-projects-get';
import { Project } from '../models/project';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `courseIterationsCourseIterationIdProjectsGet()` */
  static readonly CourseIterationsCourseIterationIdProjectsGetPath = '/course-iterations/{courseIterationId}/projects';

  /**
   * Retrieve projects from a specific course iteration.
   *
   * Returns projects from a course iteration based on the provided ID.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `courseIterationsCourseIterationIdProjectsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsCourseIterationIdProjectsGet$Response(params: CourseIterationsCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Project>>> {
    return courseIterationsCourseIterationIdProjectsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve projects from a specific course iteration.
   *
   * Returns projects from a course iteration based on the provided ID.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `courseIterationsCourseIterationIdProjectsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsCourseIterationIdProjectsGet(params: CourseIterationsCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<Array<Project>> {
    return this.courseIterationsCourseIterationIdProjectsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Project>>): Array<Project> => r.body)
    );
  }

}
