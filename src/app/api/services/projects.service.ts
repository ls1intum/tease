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
import { teaseCourseIterationsCourseIterationIdProjectsGet } from '../fn/projects/tease-course-iterations-course-iteration-id-projects-get';
import { TeaseCourseIterationsCourseIterationIdProjectsGet$Params } from '../fn/projects/tease-course-iterations-course-iteration-id-projects-get';

@Injectable({ providedIn: 'root' })
export class ProjectsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `teaseCourseIterationsCourseIterationIdProjectsGet()` */
  static readonly TeaseCourseIterationsCourseIterationIdProjectsGetPath = '/tease/course-iterations/{courseIterationId}/projects';

  /**
   * Retrieve projects from a specific course iteration.
   *
   * Returns projects from a course iteration based on the provided ID.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teaseCourseIterationsCourseIterationIdProjectsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  teaseCourseIterationsCourseIterationIdProjectsGet$Response(params: TeaseCourseIterationsCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Project>>> {
    return teaseCourseIterationsCourseIterationIdProjectsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve projects from a specific course iteration.
   *
   * Returns projects from a course iteration based on the provided ID.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teaseCourseIterationsCourseIterationIdProjectsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teaseCourseIterationsCourseIterationIdProjectsGet(params: TeaseCourseIterationsCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<Array<Project>> {
    return this.teaseCourseIterationsCourseIterationIdProjectsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Project>>): Array<Project> => r.body)
    );
  }

}
