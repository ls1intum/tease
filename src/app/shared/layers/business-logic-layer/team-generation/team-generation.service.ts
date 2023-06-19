import { Student } from '../../../models/person';
import { Team } from '../../../models/team';
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export abstract class TeamGenerationService {
  abstract generate(persons: Student[], teams: Team[]): Promise<boolean>;
}
