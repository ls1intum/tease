import { Project } from '../models/project';
import { Student } from '../models/student';
import { SkillLevel } from '../models/skill';
/**
 * Created by Malte Bucksch on 16/12/2016.
 */

export abstract class ProjectHelper {
  static getPersons(teams: Project[]): Student[] {
    return [].concat(...teams.map(team => team.persons));
  }

  static getPersonsOfSkillLevelInTeam(team: Project, skillLevel: SkillLevel) {
    return team.persons.filter(person => person.supervisorAssessment === skillLevel).length;
  }
}
