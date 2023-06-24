import { TeamGenerationService } from './team-generation.service';
import { Project } from '../../../models/project';
import { Student } from '../../../models/student';
import { Injectable } from '@angular/core';
import { ProjectHelper } from '../../../helpers/project.helper';
import { SkillLevel } from '../../../models/skill';
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

@Injectable()
export class BalancedTeamGenerationService implements TeamGenerationService {
  generate(persons: Student[], teams: Project[]): Promise<boolean> {
    teams.forEach(team => team.clear());

    const skillTypes = this.getSkillLevelKeys();

    for (const key of skillTypes) {
      const similarPersons = persons.filter(p => p.supervisorRating.valueOf() === key);
      this.distributePersonsEqually(similarPersons, teams);
    }

    return Promise.resolve(true);
  }

  private distributePersonsEqually(persons: Student[], teams: Project[]) {
    let teamIndex = 0;

    persons.forEach(person => {
      teams[teamIndex].add(person);

      teamIndex = (teamIndex + 1) % teams.length;
    });
  }

  private getSkillLevelKeys(): number[] {
    return Object.keys(SkillLevel)
      .map(k => SkillLevel[k])
      .filter(v => typeof v === 'number') as number[];
  }
}
