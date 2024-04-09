import { Project, Student } from 'src/app/api/models';
import { ConstraintWrapper } from '../matching/constraints/constraint';

export interface ProjectData {
  project: Project;
  projectConstraints: ProjectConstraint[];
  fulfillsAllConstraints: Boolean;
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
