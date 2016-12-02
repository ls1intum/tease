import {Injectable} from "@angular/core";
import {Person} from "../../../models/person";
import {PERSONS} from "../../../models/mock-persons";
import {Team} from "../../../models/team";
import {TeamGenerator} from "../team_generation/TeamGenerator";
import {TeamAccessService} from "../../data-access-layer/team.access.service";
/**
 * Created by wanur on 05/11/2016.
 */

// TODO extract saving to data access layer

@Injectable()
export class TeamService {
  constructor(private teamGenerator: TeamGenerator, private teamAccessService: TeamAccessService){

  }

  generateTeams(persons: Person[]): Promise<Team[]> {
    return this.teamGenerator.generate(persons);
  }

  readTeams(): Promise<Team[]>{
    return this.teamAccessService.read();
  }

  saveTeams(teams: Team[]){
    this.teamAccessService.save(teams);
  }

  addTeamMember(person: Person, team: Team){
    // TODO implement
  }

  removeTeamMember(person: Person, team: Team){
    // TODO implement
  }
}