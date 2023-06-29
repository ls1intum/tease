import { Team } from '../models/team';
import { Student } from '../models/student';
import { SkillLevel } from '../models/generated-model/skillLevel';

export abstract class TeamHelper {
  static getStudents(teams: Team[]): Student[] {
    return [].concat(...teams.map(team => team.students));
  }

  static getStudentsOfSkillLevelInTeam(team: Team, skillLevel: SkillLevel) {
    return team.students.filter(student => student.supervisorAssessment === skillLevel).length;
  }
}
