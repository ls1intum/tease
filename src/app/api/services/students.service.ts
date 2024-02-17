/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Student } from '../models/student';
import { v2CourseIterationCourseIterationIdStudentsGet } from '../fn/students/v-2-course-iteration-course-iteration-id-students-get';
import { V2CourseIterationCourseIterationIdStudentsGet$Params } from '../fn/students/v-2-course-iteration-course-iteration-id-students-get';

@Injectable({ providedIn: 'root' })
export class StudentsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `v2CourseIterationCourseIterationIdStudentsGet()` */
  static readonly V2CourseIterationCourseIterationIdStudentsGetPath = '/v2/courseIteration/{courseIterationId}/students';

  /**
   * Retrieve students from a specific course iteration.
   *
   * Returns students from a course iteration based on the provided ID.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2CourseIterationCourseIterationIdStudentsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdStudentsGet$Response(params: V2CourseIterationCourseIterationIdStudentsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Student>>> {
    return v2CourseIterationCourseIterationIdStudentsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve students from a specific course iteration.
   *
   * Returns students from a course iteration based on the provided ID.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `v2CourseIterationCourseIterationIdStudentsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2CourseIterationCourseIterationIdStudentsGet(params: V2CourseIterationCourseIterationIdStudentsGet$Params, context?: HttpContext): Observable<Array<Student>> {
    return this.v2CourseIterationCourseIterationIdStudentsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Student>>): Array<Student> => r.body)
    );
  }

}
