/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Allocation } from '../../models/allocation';

export interface TeaseCourseIterationsCourseIterationIdAllocationsPost$Params {

/**
 * Unique identifier of the course iteration
 */
  courseIterationId: string;
      body?: Array<Allocation>
}

export function teaseCourseIterationsCourseIterationIdAllocationsPost(http: HttpClient, rootUrl: string, params: TeaseCourseIterationsCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, teaseCourseIterationsCourseIterationIdAllocationsPost.PATH, 'post');
  if (params) {
    rb.path('courseIterationId', params.courseIterationId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'text', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

teaseCourseIterationsCourseIterationIdAllocationsPost.PATH = '/tease/course-iterations/{courseIterationId}/allocations';
