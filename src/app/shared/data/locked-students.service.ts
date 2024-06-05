import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebsocketService } from '../network/websocket.service';
import { CourseIterationsService } from './course-iteration.service';

@Injectable({
  providedIn: 'root',
})
export class LockedStudentsService {
  private readonly LOCAL_STORAGE_KEY = 'locks';

  mappingSubject$: BehaviorSubject<StudentIdToProjectIdMapping> = new BehaviorSubject<StudentIdToProjectIdMapping>(
    this.newMapping()
  );

  constructor(
    private websocketService: WebsocketService,
    private courseIterationsService: CourseIterationsService
  ) {
    try {
      const storedMapping = localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]';
      const mapping: StudentIdToProjectIdMapping = new Map(JSON.parse(storedMapping));
      this.setLocks(mapping);
    } catch (error) {
      this.deleteLocks();
    }
  }

  setLocksAsArray(mapping: [string, string][], sentWebSocketUpdate: Boolean = true): void {
    this.setLocks(new Map(mapping), sentWebSocketUpdate);
  }

  setLocks(mapping: StudentIdToProjectIdMapping, sentWebSocketUpdate: Boolean = true): void {
    if (!mapping) {
      mapping = this.newMapping();
    }

    this.mappingSubject$.next(mapping);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, this.getLocksAsString());

    const courseIterationId = this.courseIterationsService.getCourseIteration()?.id;
    if (sentWebSocketUpdate && courseIterationId) {
      console.log('Sending locks: ', this.getLocksAsString());
      this.websocketService.send(courseIterationId, 'lockedStudents', this.getLocksAsString());
    }
  }

  get locks$(): Observable<StudentIdToProjectIdMapping> {
    return this.mappingSubject$.asObservable();
  }

  addLock(studentId: string, projectId: string): void {
    const locks = this.getLocks();
    locks.set(studentId, projectId);
    this.setLocks(locks);
  }

  removeLock(studentId: string): void {
    const locks = this.getLocks();
    locks.delete(studentId);
    this.setLocks(locks);
  }

  deleteLocks(): void {
    this.setLocks(this.newMapping());
  }

  getLocks(): StudentIdToProjectIdMapping {
    return this.mappingSubject$.getValue();
  }

  getLocksAsString(): string {
    return JSON.stringify(Array.from(this.getLocks().entries()));
  }

  private newMapping(): StudentIdToProjectIdMapping {
    return new Map<string, string>();
  }
}

export type StudentIdToProjectIdMapping = Map<string, string>;
