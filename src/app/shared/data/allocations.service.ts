import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Allocation } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
export class AllocationsService {
  constructor() {
    try {
      let allocations = JSON.parse(localStorage.getItem('allocations'));
      if (!allocations) {
        allocations = [];
      }
      this.allocationsSubject.next(allocations);
    } catch (error) {
      this.allocationsSubject.next([]);
    }

    this.allocationsSubject.subscribe(allocations => {
      localStorage.setItem('allocations', JSON.stringify(allocations));
    });
  }

  private allocationsSubject: BehaviorSubject<Allocation[]> = new BehaviorSubject<Allocation[]>([]);

  setAllocations(allocations: Allocation[]): void {
    this.allocationsSubject.next(allocations);
  }

  public deleteAllocations(): void {
    this.allocationsSubject.next([]);
  }

  public getAllocation(): Allocation[] {
    return this.allocationsSubject.getValue();
  }

  public addStudentToProject(studentId: string, projectId: string): void {
    this.removeStudentFromProjects(studentId);

    const allocations = this.getAllocation();
    const allocation = allocations.find(a => a.projectId === projectId);

    if (allocation) {
      allocation.studentIds.push(studentId);
    }
    this.allocationsSubject.next(allocations);
  }

  public removeStudentFromProjects(studentId: string): void {
    const allocations = this.getAllocation();
    allocations.forEach(allocation => {
      allocation.studentIds = allocation.studentIds.filter(id => id !== studentId);
    });
    this.allocationsSubject.next(allocations);
  }
}
