import { Injectable } from '@angular/core';
import { Team } from '../models/team';
import { Project } from 'src/app/api/models';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root',
})
export class ProjectTeamTransformerService {
  constructor() {}

  projectsToTeams(projects: Project[], persons: Person[]): Team[] {
    const teams = projects.map(project => new Team(project.name)).sort((a, b) => a.name.localeCompare(b.name));
    persons.forEach(person => {
      if (person.teamName) {
        const team = teams.find(team => team.name === person.teamName);
        if (team) {
          team.persons.push(person);
        }
      }
    });
    return teams;
  }
}
