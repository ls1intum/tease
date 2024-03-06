import { ConstraintFunction, SelectData, SelectGroup } from './constraint-function';
import { SkillProficiency } from 'src/app/api/models';

export class SkillConstraintFunction extends ConstraintFunction {
  override getConstraintFunction(): string {
    throw new Error('Method not implemented.');
  }

  override getProperties(): SelectGroup {
    //TODO Change to skills service
    const values = this.students[0].skills.map(skill => ({
      name: skill.id,
      value: `${this.id}<#>${skill.id}`,
    }));
    return { id: 'skill', name: 'Skills', values: values };
  }

  override getValues(): SelectData[] {
    return Object.values(SkillProficiency).map(skillProficiency => ({
      value: skillProficiency,
      name: skillProficiency,
    }));
  }
}
