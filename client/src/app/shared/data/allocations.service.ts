import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Allocation } from 'src/app/api/models';
import { WebsocketService } from '../network/websocket.service';
import { CourseIterationsService } from './course-iteration.service';

@Injectable({
  providedIn: 'root',
})
export class AllocationsService {
  private allocationsSubject$: BehaviorSubject<Allocation[]> = new BehaviorSubject<Allocation[]>([]);

  constructor(
    private websocketService: WebsocketService,
    private courseIterationsService: CourseIterationsService
  ) {
    try {
      const storedAllocations = localStorage.getItem('allocations') || '[]';
      const allocations = JSON.parse(storedAllocations);
      this.setAllocations(allocations);
    } catch (error) {
      this.deleteAllocations();
    }
  }

  setAllocations(allocations: Allocation[], sentWebSocketUpdate: Boolean = true): void {
    if (!allocations) {
      allocations = [];
    }

    this.allocationsSubject$.next(allocations);
    const allocationsAsString = JSON.stringify(allocations);
    localStorage.setItem('allocations', allocationsAsString);

    const courseIterationId = this.courseIterationsService.getCourseIteration()?.id;
    if (sentWebSocketUpdate && courseIterationId) {
      this.websocketService.send(courseIterationId, 'allocations', allocationsAsString);
    }
  }

  deleteAllocations(): void {
    this.setAllocations([]);
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
    const allocations = this.getAllocationsWithoutStudent(studentId);
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

  private getAllocationsWithoutStudent(studentId: string): Allocation[] {
    const allocations = this.getAllocations();
    allocations.forEach(allocation => {
      allocation.students = allocation.students.filter(id => id !== studentId);
    });
    return allocations;
  }

  removeStudentFromProjects(studentId: string): void {
    const allocations = this.getAllocations();
    allocations.forEach(allocation => {
      allocation.students = allocation.students.filter(id => id !== studentId);
    });
    this.setAllocations(allocations);
  }

  private getAllocationForProjectId(projectId: string): Allocation {
    return this.getAllocations().find(allocation => allocation.projectId === projectId);
  }
}
