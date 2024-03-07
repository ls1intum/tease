import { ConstraintFunction, SelectGroup, SelectData } from './constraint-functions/constraint-function';
import { SkillConstraintFunction } from './constraint-functions/skill-constraint-function';
import { GenderConstraintFunction } from './constraint-functions/gender-connstraint-function';
import { Skill, Student } from 'src/app/api/models';
import { DeviceConstraintFunction } from './constraint-functions/device-constraint-function';
import { Operator, getOperatorFromValue } from './constraint-utils';

export class ConstraintFunctionGenerator {
  constructor(
    private readonly students: Student[],
    private readonly skills: Skill[]
  ) {
    this.constraintFunctions = [
      new GenderConstraintFunction(students, skills),
      new SkillConstraintFunction(students, skills),
      new DeviceConstraintFunction(students, skills),
    ];
  }

  constraintFunctions: ConstraintFunction[];

  getConstraintFunctionProperties(): SelectGroup[] {
    return this.constraintFunctions.map(constraintFunction => constraintFunction.getProperties());
  }

  getConstraintFunctionOperators(idAndProperty: string): SelectData[] {
    // example idAndProperty fa5238fb-bcf5-4063-9aaf-fcfb6440b20c<#>gender
    const id = this.getId(idAndProperty);
    const constraintFunction = this.findConstraintFunction(id);
    return constraintFunction ? constraintFunction.getOperators() : [];
  }

  getConstraintFunctionValues(idAndProperty: string): SelectData[] {
    const id = this.getId(idAndProperty);
    const constraintFunction = this.findConstraintFunction(id);
    return constraintFunction ? constraintFunction.getValues() : [];
  }

  getConstraintOperators(): SelectData[] {
    return [Operator.GREATER_THAN_OR_EQUAL, Operator.LESS_THAN_OR_EQUAL].map(operator => ({
      value: operator,
      name: operator,
    }));
  }

  getConstraint(
    projectIds: string[],
    constraintFunctionIdAndProperty: string,
    constraintFunctionOperatorAsString: string,
    constraintFunctionValue: string,
    constraintOperatorAsString: string,
    constraintThreshold: number
  ): string[] {
    const id = this.getId(constraintFunctionIdAndProperty);
    const property = this.getProperty(constraintFunctionIdAndProperty);
    const operator: Operator = getOperatorFromValue(constraintFunctionOperatorAsString);
    const constraintFunction = this.findConstraintFunction(id);

    if (!constraintFunction) return [];

    return projectIds.map(projectId => {
      return (
        this.getConstraintFunction(constraintFunction, projectId, property, operator, constraintFunctionValue) +
        ' ' +
        constraintOperatorAsString +
        ' ' +
        constraintThreshold
      );
    });
  }

  private getConstraintFunction(
    constraintFunction: ConstraintFunction,
    projectId: string,
    constraintFunctionProperty: string,
    constraintFunctionOperator: Operator,
    constraintFunctionValue: string
  ): string {
    return constraintFunction.getConstraintFunction(
      projectId,
      constraintFunctionProperty,
      constraintFunctionOperator,
      constraintFunctionValue
    );
  }

  private findConstraintFunction(id: string): ConstraintFunction {
    if (!id) return null;
    return this.constraintFunctions.find(constraintFunction => constraintFunction.id === id);
  }

  private getId(idAndProperty: string): string {
    return idAndProperty.split('<#>')[0];
  }

  private getProperty(idAndProperty: string): string {
    return idAndProperty.split('<#>')[1];
  }
}
