import { Injectable } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { ApiFnRequired } from '../../api/api.service';
import { courseIterationsCourseIterationIdProjectsGet as getProjects } from '../../api/fn/projects/course-iterations-course-iteration-id-projects-get';
import { courseIterationsCourseIterationIdSkillsGet as getSkills } from '../../api/fn/skills/course-iterations-course-iteration-id-skills-get';
import { courseIterationsCourseIterationIdStudentsGet as getStudents } from '../../api/fn/students/course-iterations-course-iteration-id-students-get';
import { courseIterationsCourseIterationIdAllocationsGet as getAllocations } from '../../api/fn/allocations/course-iterations-course-iteration-id-allocations-get';
import { courseIterationsCourseIterationIdAllocationsPost as postAllocations } from 'src/app/api/fn/allocations/course-iterations-course-iteration-id-allocations-post';
import { Observable, lastValueFrom } from 'rxjs';
import { Skill, Student, Project, Allocation } from 'src/app/api/models';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { SkillLevels } from '../matching/constraints/constraint-utils';

@Injectable({
  providedIn: 'root',
})
export class StudentSortService {
  sortStudentsInAllocations(students: Student[], allocations: Allocation[]): Allocation[] {
    return allocations.map(allocation => this.sortStudentsInAllocation(students, allocation));
  }

  sortStudentsInAllocation(students: Student[], allocation: Allocation): Allocation {
    const studentsInAllocation =
      allocation.students.map(studentId => {
        return students.find(student => student.id == studentId);
      }) || [];
    const sortedStudents = this.sortStudentsByProficiency(studentsInAllocation);
    const sortedStudentIds = sortedStudents.map(student => student.id);
    return { projectId: allocation.projectId, students: sortedStudentIds };
  }

  sortStudentsByProficiency(students: Student[]): Student[] {
    return students.sort((s1, s2) => SkillLevels[s2.introCourseProficiency] - SkillLevels[s1.introCourseProficiency]);
  }
}
