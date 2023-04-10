import { Constraint, ConstraintType } from './constraint';
import { Team } from '../team';

export class GenericBooleanConstraint extends Constraint {

  name: string

  constructor(config: any) {
    super(config)
  }

  public setName(name: string) {
    this.name = name;
  }

  isSatisfied(team: Team): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }

  private countPersonsWithAttribute(team: Team) {
    return team.persons.filter(person => person.booleanAttributes.indexOf(this.name) > -1).length;
  }

  getName(): string {
    return this.name;
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Team): number {
    return this.countPersonsWithAttribute(team)
  }
}
