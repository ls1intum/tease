/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Project } from '../../models/project';

export interface TeaseCourseIterationsCourseIterationIdProjectsGet$Params {

/**
 * Unique identifier of the course iteration
 */
  courseIterationId: string;
}

export function teaseCourseIterationsCourseIterationIdProjectsGet(http: HttpClient, rootUrl: string, params: TeaseCourseIterationsCourseIterationIdProjectsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Project>>> {
  const rb = new RequestBuilder(rootUrl, teaseCourseIterationsCourseIterationIdProjectsGet.PATH, 'get');
  if (params) {
    rb.path('courseIterationId', params.courseIterationId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Project>>;
    })
  );
}

teaseCourseIterationsCourseIterationIdProjectsGet.PATH = '/tease/course-iterations/{courseIterationId}/projects';
