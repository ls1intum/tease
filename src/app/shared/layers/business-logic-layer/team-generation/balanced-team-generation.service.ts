import { TeamGenerationService } from './team-generation.service';
import { Team } from '../../../models/team';
import { Student } from '../../../models/student';
import { Injectable } from '@angular/core';
import { TeamHelper } from '../../../helpers/team.helper';
import { SkillLevel } from '../../../models/skill';
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

@Injectable()
export class BalancedTeamGenerationService implements TeamGenerationService {
  generate(students: Student[], teams: Team[]): Promise<boolean> {
    teams.forEach(team => team.clear());

    const skillTypes = this.getSkillLevelKeys();

    for (const key of skillTypes) {
      const similarStudents = students.filter(p => p.supervisorRating.valueOf() === key);
      this.distributeStudentsEqually(similarStudents, teams);
    }

    return Promise.resolve(true);
  }

  private distributeStudentsEqually(students: Student[], teams: Team[]) {
    let teamIndex = 0;

    students.forEach(student => {
      teams[teamIndex].add(student);

      teamIndex = (teamIndex + 1) % teams.length;
    });
  }

  private getSkillLevelKeys(): number[] {
    return Object.keys(SkillLevel)
      .map(k => SkillLevel[k])
      .filter(v => typeof v === 'number') as number[];
  }
}
