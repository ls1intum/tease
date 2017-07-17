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
  private readonly EXPORT_FILE_NAME = "team_data.csv";

  constructor(private teamAccessService: TeamAccessService) {

  }


  readSavedTeams(): Promise<Team[]> {
    return this.teamAccessService.readSavedTeams();
  }

  readLocalTeamData(csvFile: File): Promise<Team[]> {
    return this.teamAccessService.readTeamsFromSource(csvFile);
  }

  readRemoteTeamData(remoteFilePath: string): Promise<Team[]> {
    return this.teamAccessService.readTeamsFromRemote(remoteFilePath);
  }

  exportTeams() {
    let csvData = this.teamAccessService.exportSavedTeamsAsCsv();
    let blob = new Blob([csvData], {type: this.EXPORT_DATA_TYPE});
    FileSaver.saveAs(blob, this.EXPORT_FILE_NAME);
  }

  saveTeams(teams: Team[]): Promise<boolean> {
    return this.teamAccessService.saveTeams(teams);
  }

  dropData() {
    this.teamAccessService.dropData();
  }

  readSavedPersons(): Promise<Person[]> {
    return new Promise((resolve, reject) => {
      this.readSavedTeams().then(teams => {
        resolve(TeamHelper.getPersons(teams));
      });
    });
  }

  readPersonWithId(tumId: string): Promise<Person> {
    return new Promise((resolve, reject) => {
      this.readSavedPersons().then(persons => {
        let personsWithId = persons.filter(person => person.tumId === tumId);
        if (personsWithId.length == 0) resolve(undefined);
        resolve(personsWithId[0]);
      });
    });
  }
}
