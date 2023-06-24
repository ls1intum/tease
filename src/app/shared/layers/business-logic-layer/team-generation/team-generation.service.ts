import { Student } from '../../../models/student';
import { Project } from '../../../models/project';
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

export abstract class TeamGenerationService {
  abstract generate(persons: Student[], teams: Project[]): Promise<boolean>;
}
