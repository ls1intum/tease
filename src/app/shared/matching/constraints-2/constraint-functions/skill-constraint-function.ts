import { ConstraintFunction, SelectData, SelectGroup } from './constraint-function';
import { Operator, SkillLevels, mapTwoValues, Comparator } from '../constraint-utils';
import { SkillProficiency, StudentSkill } from 'src/app/api/models';

export class SkillConstraintFunction extends ConstraintFunction {
  override getConstraintFunction(projectId: string, property: string, operator: Operator, value: string): string {
    return this.combineStudentAndProjects(
      projectId,
      this.students.filter(student =>
        this.fulfillsConstraint(student.skills, property, operator, value as SkillProficiency)
      )
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

  override getProperties(): SelectGroup {
    const values = this.skills.map(skill => ({
      name: skill.title,
      value: mapTwoValues(this.id, skill.id),
    }));
    return { name: 'Skills', values: values };
  }

  override getValues(): SelectData[] {
    return Object.values(SkillProficiency).map(skillProficiency => ({
      value: skillProficiency,
      name: skillProficiency,
    }));
  }
}
