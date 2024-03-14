import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstraintWrapper } from '../matching/constraints/constraint';

@Injectable({
  providedIn: 'root',
})
export class ConstraintsService {
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

  private constraintsSubject$: BehaviorSubject<ConstraintWrapper[]> = new BehaviorSubject<ConstraintWrapper[]>([]);

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
    console.log(this.constraintsSubject$.getValue());
    return this.constraintsSubject$.getValue();
  }
}
