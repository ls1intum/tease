import { Injectable } from '@angular/core';
import { Team } from '../models/team';
import { Allocation, Project } from 'src/app/api/models';

@Injectable({
  providedIn: 'root',
})
// TODO: Delete after removing person and team code
export class TeamToProjectService {
  constructor() {}

  transformTeamsToAllocations(teams: Team[]): Allocation[] {
    return teams.map(team => {
      const studentIds = team.persons.map(person => person.tumId);
      return { projectId: team.name, students: studentIds };
    });
  }

  transformTeamsToProjects(teams: Team[]): Project[] {
    return teams.map(team => ({ name: team.name, id: team.name }));
  }
}
