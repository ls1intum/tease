import { Project, Student } from 'src/app/api/models';
import { ConstraintWrapper } from '../matching/constraints/constraint';

export interface ProjectData {
  project: Project;
  constraints: ProjectConstraint[];
  error: ProjectError;
  students: Student[];
}

export interface ProjectConstraint {
  constraintWrapper: ConstraintWrapper;
  numberOfStudents: number;
}

export interface AllocationData {
  studentsWithoutTeam: Student[];
  projectsData: ProjectData[];
}

export interface ProjectError {
  error: boolean;
  info: string;
}
