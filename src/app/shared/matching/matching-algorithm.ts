import { Allocation, Project, Student } from 'src/app/api/models';

export interface MatchingAlgorithm {
  match(students: Student[], projects: Project[]): Allocation[];
}
