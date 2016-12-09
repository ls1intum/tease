import {Injectable} from "@angular/core";
import {Person} from "../../../models/person";
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

  read(): Promise<Team[]>{
    return this.teamAccessService.read();
  }

  readCsv(csvFile: File): Promise<Team[]> {
    return this.teamAccessService.readCsv(csvFile);
  }

  save(teams: Team[]){
    this.teamAccessService.save(teams);
  }

  dropData(){
    this.teamAccessService.dropData();
  }

  addTeamMember(person: Person, team: Team){
    // TODO implement
  }

  removeTeamMember(person: Person, team: Team){
    // TODO implement
  }
}
