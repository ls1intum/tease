import {TeamGenerationService} from "./team-generation.service";
import {Team} from "../../models/team";
import {Person} from "../../models/person";
import {Injectable} from "@angular/core";
import {TeamHelper} from "../../helpers/TeamHelper";
import {SkillLevel} from "../../models/skill";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */

@Injectable()
export class BalancedTeamGenerationService implements TeamGenerationService {
  generate(teams: Team[]): Promise<Team[]> {
    let persons = TeamHelper.getPersons(teams);
    teams.forEach(team => team.clear());
    let realTeams = teams.filter(team => team.name !== Team.OrphanTeamName);

    let skillTypes = this.getSkillLevelKeys();

    for(let key of skillTypes){
      let similarPersons = persons.filter(p => p.supervisorRating.valueOf() === key);
      this.distributePersonsEqually(similarPersons,realTeams);
    }

    return Promise.resolve(teams);
  }

  private distributePersonsEqually(persons: Person[], teams: Team[]){
    let teamIndex = 0;

    persons.forEach(person => {
      teams[teamIndex].add(person);

      teamIndex=(teamIndex+1)%teams.length;
    });
  }

  private getSkillLevelKeys(): number[] {
    return Object.keys(SkillLevel)
      .map(k => SkillLevel[k])
      .filter(v => typeof v === "number") as number[];
  }
}
