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
      const storedConstraints = localStorage.getItem('constraints') || '[]';
      const constraints: ConstraintWrapper[] = JSON.parse(storedConstraints);
      this.setConstraints(constraints);
    } catch (error) {
      this.deleteConstraints();
    }
  }

  get constraints$(): Observable<ConstraintWrapper[]> {
    return this.constraintsSubject$.asObservable();
  }

  setConstraints(constraints: ConstraintWrapper[]): void {
    this.constraintsSubject$.next(constraints);
    localStorage.setItem('constraints', JSON.stringify(constraints));
  }

  addConstraint(constraint: ConstraintWrapper): void {
    const constraints = this.getConstraints();
    constraints.push(constraint);
    this.setConstraints(constraints);
  }

  deleteConstraints(): void {
    this.setConstraints([]);
  }

  getConstraints(): ConstraintWrapper[] {
    return this.constraintsSubject$.getValue();
  }

  getConstraint(id: string): ConstraintWrapper {
    return this.getConstraints().find(constraint => constraint.id === id);
  }

  deleteConstraint(id: string): void {
    let constraints = this.getConstraints();
    constraints = constraints.filter(constraint => constraint.id !== id);
    this.setConstraints(constraints);
  }

  replaceConstraint(id: string, newConstraint: ConstraintWrapper): void {
    let constraints = this.getConstraints();
    if (this.getConstraint(id)) {
      constraints = constraints.map(storedConstraint =>
        storedConstraint.id === id ? newConstraint : storedConstraint
      );
      this.setConstraints(constraints);
      return;
    }
    this.addConstraint(newConstraint);
  }

  setActive(id: string, active: boolean): void {
    const constraint = this.getConstraint(id);
    if (!constraint) {
      return;
    }
    constraint.active = active;
    this.replaceConstraint(id, constraint);
  }
}
