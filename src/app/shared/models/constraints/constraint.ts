import {Team} from "../team";
/**
 * Created by Malte Bucksch on 23/02/2017.
 */

export abstract class Constraint {
  abstract toString(): string;
  abstract isSatisfied(team: Team): boolean;
  abstract calculateSatisfactionScore(team: Team): number;
  abstract getValue(): number;
}
