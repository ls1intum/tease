import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Allocation } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class AllocationsService {
  constructor() {
    try {
      const allocations = JSON.parse(localStorage.getItem('allocations')) || [];
      this.allocationsSubject$.next(allocations);
    } catch (error) {
      this.allocationsSubject$.next([]);
    }

    this.allocationsSubject$.subscribe(allocations => {
      localStorage.setItem('allocations', JSON.stringify(allocations));
    });
  }

  private allocationsSubject$: BehaviorSubject<Allocation[]> = new BehaviorSubject<Allocation[]>([]);

  setAllocations(allocations: Allocation[]): void {
    this.allocationsSubject$.next(allocations);
  }

  deleteAllocations(): void {
    this.allocationsSubject$.next([]);
  }

  getAllocations(): Allocation[] {
    return this.allocationsSubject$.getValue();
  }

  get allocations$(): Observable<Allocation[]> {
    return this.allocationsSubject$.asObservable();
  }

  moveStudentToProject(studentId: string, projectId: string): void {
    this.removeStudentFromProjects(studentId);

    const allocations = this.getAllocations();
    const allocation = allocations.find(a => a.projectId === projectId);

    if (allocation) {
      allocation.students.push(studentId);
    }
    this.setAllocations(allocations);
  }

  moveStudentToProjectAtInset(studentId: string, projectId: string, siblingId?: string): void {
    this.removeStudentFromProjects(studentId);

    const allocations = this.getAllocations();
    const allocation = allocations.find(a => a.projectId === projectId);

    if (allocation && siblingId) {
      const index = allocation.students.indexOf(siblingId);
      allocation.students.splice(index, 0, studentId);
      this.setAllocations(allocations);
    } else {
      this.moveStudentToProject(studentId, projectId);
    }
  }

  removeStudentFromProjects(studentId: string): void {
    const allocations = this.getAllocations();
    allocations.forEach(allocation => {
      allocation.students = allocation.students.filter(id => id !== studentId);
    });
    this.allocationsSubject$.next(allocations);
  }
}
