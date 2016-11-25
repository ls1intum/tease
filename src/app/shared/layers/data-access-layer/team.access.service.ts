import {Injectable} from "@angular/core";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
@Injectable()
export abstract class TeamAccessService {
  abstract save(persons: Team[]);
  abstract read(): Promise<Team[]>;
}
