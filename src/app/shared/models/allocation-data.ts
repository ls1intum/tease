import { Project, Student } from 'src/app/api/models';
import { ConstraintWrapper } from '../matching/constraints/constraint';

export interface ProjectData {
  project: Project;
  constraintData: ProjectConstraint[];
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

// export interface ProjectError {
//   error: boolean;
//   info: string;
// }
