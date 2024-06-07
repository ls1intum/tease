import { ConstraintFunction, PropertySelectGroup, SelectData } from './constraint-function';
import { Comparator, LanguageLevels, Operator } from '../constraint-utils';
import { Student, Skill, LanguageProficiency } from 'src/app/api/models';

export class LanguageProficiencyConstraintFunction extends ConstraintFunction {
  constructor(students: Student[], skills: Skill[]) {
    super(students, skills, 'Language Proficiency');
  }

  override filterStudentsByConstraintFunction(property: string, operator: Operator, value: string): Student[] {
    const languageInConstraint = property;

    return this.students.filter(student => {
      const studentLanguage = student.languages.find(language => language.language == languageInConstraint);
      if (!studentLanguage) {
        return false;
      }
      return Comparator[operator](
        LanguageLevels[studentLanguage.proficiency],
        LanguageLevels[value as LanguageProficiency]
      );
    });
  }

  override getProperties(): PropertySelectGroup {
    return {
      name: 'Language Proficiency',
      constraintFunction: this,
      values: [
        { id: 'en', name: 'English' },
        { id: 'de', name: 'German' },
      ],
    };
  }

  override getValues(): SelectData[] {
    return Object.values(LanguageProficiency).map(languageProficiency => ({
      id: languageProficiency,
      name: languageProficiency,
    }));
  }
}
