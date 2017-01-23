import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
import {TeamGenerationService} from "./team-generation/team-generation.service";
import {TeamAccessService} from "../data-access-layer/team.access.service";
import {TeamHelper} from "../../helpers/team.helper";
/**
 * Created by wanur on 05/11/2016.
 */

let FileSaver = require('file-saver');

@Injectable()
export class TeamService {
  private readonly EXPORT_DATA_TYPE = "text/csv;charset=utf-8";

  constructor(private teamAccessService: TeamAccessService){

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

  readPersons(): Promise<Person[]>{
    return new Promise((resolve,reject) => {
      this.read().then(teams => {
          resolve(TeamHelper.getPersons(teams));
        });
    });
  }
}
