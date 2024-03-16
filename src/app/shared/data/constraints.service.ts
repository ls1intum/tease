import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstraintWrapper } from '../matching/constraints/constraint';

@Injectable({
  providedIn: 'root',
})
export class ConstraintsService {
  private constraintsSubject$: BehaviorSubject<ConstraintWrapper[]> = new BehaviorSubject<ConstraintWrapper[]>([]);

  constructor() {
    try {
      const constraints: ConstraintWrapper[] = JSON.parse(localStorage.getItem('constraints')) || [];
      this.setConstraints(constraints);
    } catch (error) {
      this.setConstraints([]);
    }

    this.constraintsSubject$.subscribe(constraints => {
      localStorage.setItem('constraints', JSON.stringify(constraints));
    });
  }

  get constraints$(): Observable<ConstraintWrapper[]> {
    return this.constraintsSubject$.asObservable();
  }

  setConstraints(constraints: ConstraintWrapper[]): void {
    this.constraintsSubject$.next(constraints);
  }

  addConstraint(constraint: ConstraintWrapper): void {
    const constraints = this.getConstraints();
    constraints.push(constraint);
    this.setConstraints(constraints);
  }

  deleteConstraints(): void {
    this.constraintsSubject$.next([]);
  }

  getConstraints(): ConstraintWrapper[] {
    return this.constraintsSubject$.getValue();
  }

  deleteConstraint(constraint: ConstraintWrapper): void {
    const constraints = this.getConstraints();
    const index = constraints.indexOf(constraint);
    constraints.splice(index, 1);
    this.setConstraints(constraints);
  }
}
