import {Injectable} from "@angular/core";
import {Person} from "../../../models/person";
import {Team} from "../../../models/team";
import {TeamGenerator} from "../team_generation/TeamGenerator";
import {TeamAccessService} from "../../data-access-layer/team.access.service";
/**
 * Created by wanur on 05/11/2016.
 */

let FileSaver = require('file-saver');

@Injectable()
export class TeamService {
  private readonly EXPORT_DATA_TYPE = "text/csv;charset=utf-8";

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

  exportTeams(fileName: string){
    let csvData = this.teamAccessService.readCsvData();
    let blob = new Blob([csvData], {type: this.EXPORT_DATA_TYPE});
    FileSaver.saveAs(blob, fileName);
  }

  save(teams: Team[]){
    this.teamAccessService.save(teams);
  }

  dropData(){
    this.teamAccessService.dropData();
  }
}
