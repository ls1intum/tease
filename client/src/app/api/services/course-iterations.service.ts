/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CourseIteration } from '../models/course-iteration';
import { courseIterationsGet } from '../fn/course-iterations/course-iterations-get';
import { CourseIterationsGet$Params } from '../fn/course-iterations/course-iterations-get';

@Injectable({ providedIn: 'root' })
export class CourseIterationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `courseIterationsGet()` */
  static readonly CourseIterationsGetPath = '/course-iterations';

  /**
   * Retrieve all course iterations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `courseIterationsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsGet$Response(params?: CourseIterationsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<CourseIteration>>> {
    return courseIterationsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve all course iterations.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `courseIterationsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsGet(params?: CourseIterationsGet$Params, context?: HttpContext): Observable<Array<CourseIteration>> {
    return this.courseIterationsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<CourseIteration>>): Array<CourseIteration> => r.body)
    );
  }

}
