import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private studentsSubject$: BehaviorSubject<Student[]> = new BehaviorSubject<Student[]>([]);

  constructor() {
    try {
      const storedStudents = localStorage.getItem('students') || '[]';
      const students = JSON.parse(storedStudents);
      this.setStudents(students);
    } catch (error) {
      this.deleteStudents();
    }
  }

  setStudents(students: Student[]): void {
    this.studentsSubject$.next(students);
    localStorage.setItem('students', JSON.stringify(students));
  }

  deleteStudents(): void {
    this.setStudents([]);
  }

  getStudents(): Student[] {
    return this.studentsSubject$.getValue();
  }

  get students$(): Observable<Student[]> {
    return this.studentsSubject$.asObservable();
  }

  getStudentById(id: string): Student {
    return this.getStudents().find(student => student.id === id);
  }
}
