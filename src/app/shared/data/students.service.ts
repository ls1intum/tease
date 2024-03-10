import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  constructor() {
    try {
      const students = JSON.parse(localStorage.getItem('students')) || [];
      this.studentsSubject$.next(students);
    } catch (error) {
      this.studentsSubject$.next([]);
    }

    this.studentsSubject$.subscribe(students => {
      localStorage.setItem('students', JSON.stringify(students));
    });
  }

  private studentsSubject$: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);

  setStudents(students: Student[]): void {
    this.studentsSubject$.next(students);
  }

  deleteStudents(): void {
    this.studentsSubject$.next([]);
  }

  getStudents(): Student[] {
    return this.studentsSubject$.getValue();
  }

  get students$(): Observable<Student[]> {
    return this.studentsSubject$.asObservable();
  }

  getStudentById(id: string): Student {
    return this.studentsSubject$.getValue().find(student => student.id === id);
  }
}
