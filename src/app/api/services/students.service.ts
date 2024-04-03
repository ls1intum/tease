/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { courseIterationsCourseIterationIdStudentsGet } from '../fn/students/course-iterations-course-iteration-id-students-get';
import { CourseIterationsCourseIterationIdStudentsGet$Params } from '../fn/students/course-iterations-course-iteration-id-students-get';
import { Student } from '../models/student';

@Injectable({ providedIn: 'root' })
export class StudentsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `courseIterationsCourseIterationIdStudentsGet()` */
  static readonly CourseIterationsCourseIterationIdStudentsGetPath = '/course-iterations/{courseIterationId}/students';

  /**
   * Retrieve students from a specific course iteration.
   *
   * Returns students from a course iteration based on the provided ID.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `courseIterationsCourseIterationIdStudentsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsCourseIterationIdStudentsGet$Response(params: CourseIterationsCourseIterationIdStudentsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Student>>> {
    return courseIterationsCourseIterationIdStudentsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Retrieve students from a specific course iteration.
   *
   * Returns students from a course iteration based on the provided ID.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `courseIterationsCourseIterationIdStudentsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  courseIterationsCourseIterationIdStudentsGet(params: CourseIterationsCourseIterationIdStudentsGet$Params, context?: HttpContext): Observable<Array<Student>> {
    return this.courseIterationsCourseIterationIdStudentsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Student>>): Array<Student> => r.body)
    );
  }

}
