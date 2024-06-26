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
import { teaseCourseIterationsCourseIterationIdAllocationsGet } from '../fn/allocations/tease-course-iterations-course-iteration-id-allocations-get';
import { TeaseCourseIterationsCourseIterationIdAllocationsGet$Params } from '../fn/allocations/tease-course-iterations-course-iteration-id-allocations-get';
import { teaseCourseIterationsCourseIterationIdAllocationsPost } from '../fn/allocations/tease-course-iterations-course-iteration-id-allocations-post';
import { TeaseCourseIterationsCourseIterationIdAllocationsPost$Params } from '../fn/allocations/tease-course-iterations-course-iteration-id-allocations-post';

@Injectable({ providedIn: 'root' })
export class AllocationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `teaseCourseIterationsCourseIterationIdAllocationsGet()` */
  static readonly TeaseCourseIterationsCourseIterationIdAllocationsGetPath = '/tease/course-iterations/{courseIterationId}/allocations';

  /**
   * Retrieve the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teaseCourseIterationsCourseIterationIdAllocationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  teaseCourseIterationsCourseIterationIdAllocationsGet$Response(params: TeaseCourseIterationsCourseIterationIdAllocationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Allocation>>> {
    return teaseCourseIterationsCourseIterationIdAllocationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teaseCourseIterationsCourseIterationIdAllocationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  teaseCourseIterationsCourseIterationIdAllocationsGet(params: TeaseCourseIterationsCourseIterationIdAllocationsGet$Params, context?: HttpContext): Observable<Array<Allocation>> {
    return this.teaseCourseIterationsCourseIterationIdAllocationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Allocation>>): Array<Allocation> => r.body)
    );
  }

  /** Path part for operation `teaseCourseIterationsCourseIterationIdAllocationsPost()` */
  static readonly TeaseCourseIterationsCourseIterationIdAllocationsPostPath = '/tease/course-iterations/{courseIterationId}/allocations';

  /**
   * Submit the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `teaseCourseIterationsCourseIterationIdAllocationsPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teaseCourseIterationsCourseIterationIdAllocationsPost$Response(params: TeaseCourseIterationsCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return teaseCourseIterationsCourseIterationIdAllocationsPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Submit the final result of the matching/allocation.
   *
   * After the allocation is concluded, TEASE can report the results (which team each student was assigned to) to PROMPT without needing to repeat/send back all of the information that was initially sent
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `teaseCourseIterationsCourseIterationIdAllocationsPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  teaseCourseIterationsCourseIterationIdAllocationsPost(params: TeaseCourseIterationsCourseIterationIdAllocationsPost$Params, context?: HttpContext): Observable<void> {
    return this.teaseCourseIterationsCourseIterationIdAllocationsPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
