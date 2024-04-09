import { ConstraintFunction, PropertySelectGroup, SelectData } from './constraint-function';
import { Comparator, Operator, SkillLevels } from '../constraint-utils';
import { Student, Skill, SkillProficiency } from 'src/app/api/models';

export class IntroCourseProficiencyConstraintFunction extends ConstraintFunction {
  constructor(students: Student[], skills: Skill[]) {
    super(students, skills, 'Intro Course Proficiency');
  }

  override filterStudentsByConstraintFunction(property: string, operator: Operator, value: string): Student[] {
    return this.students.filter(student =>
      Comparator[operator](SkillLevels[student.introCourseProficiency], SkillLevels[value as SkillProficiency])
    );
  }

  override getProperties(): PropertySelectGroup {
    return {
      name: 'Intro Course Proficiency',
      constraintFunction: this,
      values: [{ id: 'cf-intro-course-proficiency', name: 'Intro Course Proficiency' }],
    };
  }

  override getValues(): SelectData[] {
    return Object.values(SkillProficiency).map(skillProficiency => ({
      id: skillProficiency,
      name: skillProficiency,
    }));
  }
}
