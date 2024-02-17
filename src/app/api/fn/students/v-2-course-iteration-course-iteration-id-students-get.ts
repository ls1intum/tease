/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Student } from '../../models/student';

export interface V2CourseIterationCourseIterationIdStudentsGet$Params {

/**
 * Unique identifier of the course iteration
 */
  courseIterationId: string;
}

export function v2CourseIterationCourseIterationIdStudentsGet(http: HttpClient, rootUrl: string, params: V2CourseIterationCourseIterationIdStudentsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Student>>> {
  const rb = new RequestBuilder(rootUrl, v2CourseIterationCourseIterationIdStudentsGet.PATH, 'get');
  if (params) {
    rb.path('courseIterationId', params.courseIterationId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Student>>;
    })
  );
}

v2CourseIterationCourseIterationIdStudentsGet.PATH = '/v2/courseIteration/{courseIterationId}/students';