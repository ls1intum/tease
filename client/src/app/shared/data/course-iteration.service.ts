import { Injectable } from '@angular/core';
import { CourseIteration } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class CourseIterationsService {
  private readonly COURSE_ITERATION_KEY = 'tease-course-iteration';

  getCourseIteration(): CourseIteration {
    const courseIteration = localStorage.getItem(this.COURSE_ITERATION_KEY);
    if (!courseIteration) {
      console.log('No course iteration found in local storage');
      console.log(localStorage.getItem(this.COURSE_ITERATION_KEY));
      return null;
    }
    return JSON.parse(courseIteration);
  }

  setCourseIteration(courseIteration?: CourseIteration): void {
    if (!courseIteration) {
      localStorage.removeItem(this.COURSE_ITERATION_KEY);
      return;
    }
    localStorage.setItem(this.COURSE_ITERATION_KEY, JSON.stringify(courseIteration));
  }
}
