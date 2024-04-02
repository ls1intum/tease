import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocksService {
  private readonly LOCAL_STORAGE_KEY = 'locks';

  mappingSubject$: BehaviorSubject<StudentIdToProjectIdMapping> = new BehaviorSubject<StudentIdToProjectIdMapping>(
    this.newMapping()
  );

  constructor() {
    try {
      const storedMapping = localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]';
      const mapping: StudentIdToProjectIdMapping = new Map(JSON.parse(storedMapping));
      this.setLocks(mapping);
    } catch (error) {
      this.deleteLocks();
    }
  }

  private setLocks(mapping: StudentIdToProjectIdMapping): void {
    this.mappingSubject$.next(mapping);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(Array.from(mapping.entries())));
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

  private newMapping(): StudentIdToProjectIdMapping {
    return new Map<string, string>();
  }
}

export type StudentIdToProjectIdMapping = Map<string, string>;
