import { ConstraintFunction, SelectData, PropertySelectGroup } from './constraint-function';
import { Operator, SkillLevels, Comparator } from '../constraint-utils';
import { SkillProficiency, Student, StudentSkill } from 'src/app/api/models';

export class SkillConstraintFunction extends ConstraintFunction {
  override filterStudentsByConstraintFunction(property: string, operator: Operator, value: string): Student[] {
    return this.students.filter(student =>
      this.fulfillsConstraint(student.skills, property, operator, value as SkillProficiency)
    );
  }

  private fulfillsConstraint(
    studentSkills: StudentSkill[],
    skillId: string,
    operator: Operator,
    skillProficiency: SkillProficiency
  ): boolean {
    for (const studentSkill of studentSkills) {
      if (studentSkill.id === skillId) {
        if (Comparator[operator](SkillLevels[studentSkill.proficiency], SkillLevels[skillProficiency])) {
          return true;
        }
      }
    }
    return false;
  }

  override getProperties(): PropertySelectGroup {
    const values = this.skills.map(skill => ({
      id: skill.id,
      name: skill.title,
    }));
    return { name: 'Skills', constraintFunction: this, values: values };
  }

  override getValues(): SelectData[] {
    return Object.values(SkillProficiency).map(skillProficiency => ({
      id: skillProficiency,
      name: skillProficiency,
    }));
  }
}
