import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
@Injectable()
export abstract class TeamAccessService {
  abstract save(teams: Team[]);
  abstract read(): Promise<Team[]>;
  abstract readCsv(csvFile: File): Promise<Team[]>;
  abstract dropData();
  abstract readCsvData(): string;
  abstract addTeamMember(person: Person, team: Team);
  abstract removeTeamMember(person: Person, team: Team);
}
