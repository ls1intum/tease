import { Injectable } from '@angular/core';
import { ConstraintFunction, SelectGroup, SelectData } from './constraint-function';
import { Student } from 'src/app/api/models';
import { SkillConstraintFunction } from './skill-constraint-function';
import { GenderConstraintFunction } from './gender-connstraint-function';

@Injectable({
  providedIn: 'root',
})
export class ConstraintFunctionGeneratorService {
  constructor() {}

  private constraintFunctions: (new (students: Student[], projectId: string) => ConstraintFunction)[] = [
    GenderConstraintFunction,
    SkillConstraintFunction,
  ];

  getProperties(students: Student[], projectId: string): SelectGroup[] {
    return this.constraintFunctions.map(constraintFunctionClass =>
      new constraintFunctionClass(students, projectId).getProperties()
    );
  }

  getOperators(id: string): SelectData[] {
    // return this.constraintFunctions.map(constraintFunctionClass =>
    //   new constraintFunctionClass(students, projectId).getOperators()
    // );
    return [];
  }

  getValues(): SelectData[] {
    // return this.constraintFunctions.map(constraintFunctionClass =>
    //   new constraintFunctionClass(students, projectId).getValues()
    // );
    return [];
  }
}
