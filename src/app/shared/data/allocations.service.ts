import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Allocation } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class AllocationsService {
  private allocationsSubject$: BehaviorSubject<Allocation[]> = new BehaviorSubject<Allocation[]>([]);

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
    this.moveStudentToProjectAtPosition(studentId, projectId);
  }

  moveStudentToProjectAtPosition(studentId: string, projectId: string, siblingId?: string): void {
    this.removeStudentFromProjects(studentId);
    const allocations = this.getAllocations();
    const allocation = this.getAllocationForProjectId(projectId);
    var positionInAllocation = allocation?.students.indexOf(siblingId) ?? -1;

    if (allocation && positionInAllocation === -1) {
      positionInAllocation = allocation.students.length;
    }

    if (allocation) {
      allocation.students.splice(positionInAllocation, 0, studentId);
    } else {
      allocations.push({ projectId, students: [studentId] });
    }

    this.setAllocations(allocations);
  }

  removeStudentFromProjects(studentId: string): void {
    const allocations = this.getAllocations();
    allocations.forEach(allocation => {
      allocation.students = allocation.students.filter(id => id !== studentId);
    });
    this.allocationsSubject$.next(allocations);
  }

  private getAllocationForProjectId(projectId: string): Allocation {
    return this.getAllocations().find(allocation => allocation.projectId === projectId);
  }
}
