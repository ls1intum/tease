import { Injectable } from '@angular/core';
import { Student, Allocation } from 'src/app/api/models';
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
