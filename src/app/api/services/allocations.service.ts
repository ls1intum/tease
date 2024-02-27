/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Allocation } from '../models/allocation';
import { courseIterationsCourseIterationIdAllocationsGet } from '../fn/allocations/course-iterations-course-iteration-id-allocations-get';
import { CourseIterationsCourseIterationIdAllocationsGet$Params } from '../fn/allocations/course-iterations-course-iteration-id-allocations-get';
import { courseIterationsCourseIterationIdAllocationsPost } from '../fn/allocations/course-iterations-course-iteration-id-allocations-post';
import { CourseIterationsCourseIterationIdAllocationsPost$Params } from '../fn/allocations/course-iterations-course-iteration-id-allocations-post';

@Injectable({ providedIn: 'root' })
export class AllocationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `courseIterationsCourseIterationIdAllocationsGet()` */
  static readonly CourseIterationsCourseIterationIdAllocationsGetPath = '/course-iterations/{courseIterationId}/allocations';

  /**
   * Retrieve the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `courseIterationsCourseIterationIdAllocationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsCourseIterationIdAllocationsGet$Response(params: CourseIterationsCourseIterationIdAllocationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Allocation>>> {
    return courseIterationsCourseIterationIdAllocationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `courseIterationsCourseIterationIdAllocationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsCourseIterationIdAllocationsGet(params: CourseIterationsCourseIterationIdAllocationsGet$Params, context?: HttpContext): Observable<Array<Allocation>> {
    return this.courseIterationsCourseIterationIdAllocationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Allocation>>): Array<Allocation> => r.body)
    );
  }

  /** Path part for operation `courseIterationsCourseIterationIdAllocationsPost()` */
  static readonly CourseIterationsCourseIterationIdAllocationsPostPath = '/course-iterations/{courseIterationId}/allocations';

  /**
   * Submit the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `courseIterationsCourseIterationIdAllocationsPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  courseIterationsCourseIterationIdAllocationsPost$Response(params: CourseIterationsCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return courseIterationsCourseIterationIdAllocationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `courseIterationsCourseIterationIdAllocationsPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  courseIterationsCourseIterationIdAllocationsPost(params: CourseIterationsCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<void> {
    return this.courseIterationsCourseIterationIdAllocationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
