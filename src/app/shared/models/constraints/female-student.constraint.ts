import { Constraint, ConstraintType } from './constraint';
import { Team } from '../team';
import { Gender } from '../student';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */
export class FemaleStudentConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Team): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }

  private getFemalesPersonsInTeam(team: Team) {
    return team.persons.filter(person => person.gender === Gender.Female).length;
  }

  getName(): string {
    return 'Female Persons';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Team): number {
    return this.getFemalesPersonsInTeam(team);
  }
}
