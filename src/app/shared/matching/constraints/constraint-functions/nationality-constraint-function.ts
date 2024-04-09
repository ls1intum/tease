import { ConstraintFunction, PropertySelectGroup, SelectData } from './constraint-function';
import { Comparator, Operator } from '../constraint-utils';
import { Student, Skill } from 'src/app/api/models';

export class NationalityConstraintFunction extends ConstraintFunction {
  private nationalities: Set<string> = new Set();

  constructor(students: Student[], skills: Skill[]) {
    super(students, skills, 'Nationality', [Operator.EQUALS, Operator.NOT_EQUALS]);
    this.nationalities = new Set();
    students.forEach(student => {
      this.nationalities.add(student.nationality);
    });
  }

  override filterStudentsByConstraintFunction(property: string, operator: Operator, value: string): Student[] {
    const nationalityInConstraint = value;

    return this.students.filter(student => {
      return Comparator[operator](student.nationality, nationalityInConstraint);
    });
  }

  override getProperties(): PropertySelectGroup {
    return {
      name: 'Nationality',
      constraintFunction: this,
      values: [{ id: 'cf-nationality', name: 'Nationality' }],
    };
  }

  override getValues(): SelectData[] {
    return Array.from(this.nationalities).map(nationality => ({
      id: nationality,
      name: nationality,
    }));
  }
}
