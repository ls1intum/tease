import { Constraint, ConstraintType } from './constraint';
import { Project } from '../project';
import { Gender } from '../student';
/**
 * Created by Malte Bucksch on 23/02/2017.
 */
export class FemalePersonConstraint extends Constraint {
  constructor(config: any) {
    super(config);
  }

  isSatisfied(team: Project): boolean {
    return (this.minValue || 0) <= this.getCurrentValue(team) && this.getCurrentValue(team) <= (this.maxValue || Number.MAX_VALUE);
  }

  private getFemalesPersonsInTeam(team: Project) {
    return team.persons.filter(person => person.gender === Gender.Female).length;
  }

  getName(): string {
    return 'Female Persons';
  }

  getType(): ConstraintType {
    return ConstraintType.Interval;
  }

  getCurrentValue(team: Project): number {
    return this.getFemalesPersonsInTeam(team);
  }
}
