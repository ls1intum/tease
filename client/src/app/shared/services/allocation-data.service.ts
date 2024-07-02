import { Injectable } from '@angular/core';
import { AllocationData, ProjectConstraint, ProjectData } from '../models/allocation-data';
import { Allocation, Project, Skill, Student } from 'src/app/api/models';
import { ConstraintWrapper } from '../matching/constraints/constraint';
import { CourseIterationsService } from '../data/course-iteration.service';

@Injectable({
  providedIn: 'root',
})
export class AllocationDataService {
  constructor(private courseIterationsService: CourseIterationsService) {}

  private isDataLoaded(
    projects: Project[],
    students: Student[],
    allocations: Allocation[],
    constraintWrappers: ConstraintWrapper[],
    skills: Skill[]
  ): Boolean {
    return !!(projects?.length && students?.length && allocations && constraintWrappers && skills?.length);
  }

  getAllocationData(
    projects: Project[],
    students: Student[],
    allocations: Allocation[],
    constraintWrappers: ConstraintWrapper[],
    skills: Skill[]
  ): AllocationData {
    if (!this.isDataLoaded(projects, students, allocations, constraintWrappers, skills)) {
      return null;
    }
    return this.updateAllocation(projects, students, allocations, constraintWrappers);
  }

  private updateAllocation(
    projects: Project[],
    students: Student[],
    allocations: Allocation[],
    constraintWrappers: ConstraintWrapper[]
  ): AllocationData {
    return {
      projectsData: this.updateProjectsData(projects, students, allocations, constraintWrappers),
      studentsWithoutTeam: this.updateStudentsWithoutTeam(students, allocations),
      courseIteration: this.courseIterationsService.getCourseIteration(),
    };
  }

  private updateProjectsData(
    projects: Project[],
    students: Student[],
    allocations: Allocation[],
    constraintWrappers: ConstraintWrapper[]
  ): ProjectData[] {
    return projects.map(project => this.updateProjectData(project, students, allocations, constraintWrappers));
  }

  private updateProjectData(
    project: Project,
    students: Student[],
    allocations: Allocation[],
    constraintWrappers: ConstraintWrapper[]
  ): ProjectData {
    let studentsOfProject = this.getStudentsOfProject(students, project.id, allocations);
    const { projectConstraints, fulfillsAllConstraints } = this.getProjectConstraints(
      constraintWrappers,
      project.id,
      studentsOfProject
    );

    return {
      project: project,
      projectConstraints: projectConstraints,
      fulfillsAllConstraints: fulfillsAllConstraints,
      students: studentsOfProject,
    };
  }

  private getStudentsOfProject(students: Student[], projectId: string, allocations: Allocation[]): Student[] {
    const allocation = allocations.find(allocation => allocation.projectId === projectId);
    return allocation ? allocation.students.map(studentId => students.find(student => student.id === studentId)) : [];
  }

  private getProjectConstraints(
    constraintWrappers: ConstraintWrapper[],
    projectId: string,
    students: Student[]
  ): { projectConstraints: ProjectConstraint[]; fulfillsAllConstraints: Boolean } {
    let fulfillsAllConstraints = true;
    const constraintWrappersOfProject = this.getConstraintWrappersOfProject(constraintWrappers, projectId);
    const projectConstraints = constraintWrappersOfProject.map(constraintWrapper => {
      const numberOfStudents = this.getNumberOfStudents(constraintWrapper, students);

      const fulfillsLowerBound = constraintWrapper.threshold.lowerBound <= numberOfStudents;
      const fulfillsUpperBound = constraintWrapper.threshold.upperBound >= numberOfStudents;
      if (!fulfillsLowerBound || !fulfillsUpperBound) {
        fulfillsAllConstraints = false;
      }

      return { constraintWrapper: constraintWrapper, numberOfStudents: numberOfStudents };
    });

    return { projectConstraints: projectConstraints, fulfillsAllConstraints: fulfillsAllConstraints };
  }

  private getConstraintWrappersOfProject(
    constraintWrappers: ConstraintWrapper[],
    projectId: string
  ): ConstraintWrapper[] {
    const activeConstraintWrappers = constraintWrappers.filter(constraintWrapper => constraintWrapper.isActive);
    return activeConstraintWrappers.filter(constraintWrapper => constraintWrapper.projectIds.includes(projectId));
  }

  private getNumberOfStudents(constraintWrapper: ConstraintWrapper, students: Student[]): number {
    const studentIdsOfProject = students.map(student => student.id);
    return constraintWrapper.constraintFunction.studentIds.filter(studentId => studentIdsOfProject.includes(studentId))
      .length;
  }

  private updateStudentsWithoutTeam(students: Student[], allocations: Allocation[]): Student[] {
    return students.filter(student => !allocations.some(allocation => allocation.students.includes(student.id)));
  }
}
