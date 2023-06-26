import { Team } from '../models/team';
import { Student } from '../models/student';
import { SkillLevel } from '../models/skill';
/**
 * Created by Malte Bucksch on 16/12/2016.
 */

export abstract class TeamHelper {
  static getStudents(teams: Team[]): Student[] {
    return [].concat(...teams.map(team => team.students));
  }

  static getStudentsOfSkillLevelInTeam(team: Team, skillLevel: SkillLevel) {
    return team.students.filter(student => student.supervisorAssessment === skillLevel).length;
  }
}
