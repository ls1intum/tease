import { Student, Project, Allocation } from 'src/app/api/models';
import { MatchingAlgorithm } from './matching-algorithm';
import { Constraint } from '../models/constraints/constraint';

export class LinearProgamming implements MatchingAlgorithm {
  constructor(
    private readonly contraints: Constraint[],
    private readonly objective: string
  ) {}

  match(students: Student[], projects: Project[]): Allocation[] {
    // Matching algorithm implementation
    console.log(students, projects);
    return [];
  }
}
