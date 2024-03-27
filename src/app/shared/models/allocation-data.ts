import { Project, Student } from 'src/app/api/models';

export interface ProjectData {
  project: Project;
  error: ProjectError;
  students: Student[];
}

export interface AllocationData {
  studentsWithoutTeam: Student[];
  projectsData: ProjectData[];
}

export interface ProjectError {
  error: boolean;
  info: string;
}
