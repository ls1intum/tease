
import {TeamAccessService} from "./team.access.service";
import {Person} from "../../models/person";
import {Team} from "../../models/team";
import {TeamSerializer} from "./serialization/TeamSerializer";
import Papa = require("papaparse");
import {TeamParser} from "./parsing/TeamParser";

export class PersistentTeamAccessService extends TeamAccessService {
  private static readonly TeamStorageKey = "Teams";

  read(): Promise<Team[]> {
    let teamData = localStorage.getItem(PersistentTeamAccessService.TeamStorageKey);
    Papa.parse(teamData, {
      complete: results => {
        // TODO use promise for all of this!!!! wrap everything in promise
        callback(TeamParser.parseTeams(results.data));
      },
      header: true
    });

    return Promise.resolve(this.savedTeams);
  }

  save(teams: Team[]) {
    let teamListProperties = TeamSerializer.getTeamListProperties(teams);
    let result = Papa.unparse(teamListProperties);

    localStorage.setItem(PersistentTeamAccessService.TeamStorageKey,
      result);
  }

  addTeamMember(person: Person, team: Team) {
    team.add(person);
  }

  removeTeamMember(person: Person, team: Team) {
    team.remove(person);
  }
}
