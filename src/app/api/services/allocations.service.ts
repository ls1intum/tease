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
import { v2CourseIterationCourseIterationIdAllocationsGet } from '../fn/allocations/v-2-course-iteration-course-iteration-id-allocations-get';
import { V2CourseIterationCourseIterationIdAllocationsGet$Params } from '../fn/allocations/v-2-course-iteration-course-iteration-id-allocations-get';
import { v2CourseIterationCourseIterationIdAllocationsPost } from '../fn/allocations/v-2-course-iteration-course-iteration-id-allocations-post';
import { V2CourseIterationCourseIterationIdAllocationsPost$Params } from '../fn/allocations/v-2-course-iteration-course-iteration-id-allocations-post';

@Injectable({ providedIn: 'root' })
export class AllocationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `v2CourseIterationCourseIterationIdAllocationsGet()` */
  static readonly V2CourseIterationCourseIterationIdAllocationsGetPath = '/v2/courseIteration/{courseIterationId}/allocations';

  /**
   * Retrieve the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2CourseIterationCourseIterationIdAllocationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdAllocationsGet$Response(params: V2CourseIterationCourseIterationIdAllocationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Allocation>>> {
    return v2CourseIterationCourseIterationIdAllocationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `v2CourseIterationCourseIterationIdAllocationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdAllocationsGet(params: V2CourseIterationCourseIterationIdAllocationsGet$Params, context?: HttpContext): Observable<Array<Allocation>> {
    return this.v2CourseIterationCourseIterationIdAllocationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Allocation>>): Array<Allocation> => r.body)
    );
  }

  /** Path part for operation `v2CourseIterationCourseIterationIdAllocationsPost()` */
  static readonly V2CourseIterationCourseIterationIdAllocationsPostPath = '/v2/courseIteration/{courseIterationId}/allocations';

  /**
   * Submit the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2CourseIterationCourseIterationIdAllocationsPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  v2CourseIterationCourseIterationIdAllocationsPost$Response(params: V2CourseIterationCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return v2CourseIterationCourseIterationIdAllocationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `v2CourseIterationCourseIterationIdAllocationsPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  v2CourseIterationCourseIterationIdAllocationsPost(params: V2CourseIterationCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<void> {
    return this.v2CourseIterationCourseIterationIdAllocationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
