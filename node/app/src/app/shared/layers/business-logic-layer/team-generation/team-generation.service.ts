import {Person} from "../../../models/person";
import {Team} from "../../../models/team";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export abstract class TeamGenerationService {
  abstract generate(teams: Team[]): Promise<Team[]>;
}
