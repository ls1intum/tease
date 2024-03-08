import { Injectable } from '@angular/core';
import { Team } from '../models/team';
import { Allocation } from 'src/app/api/models';
import { ProjectsService } from '../data/projects.service';

@Injectable({
  providedIn: 'root',
})
// TODO: Delete after removing person and team code
export class TeamsToAllocationsService {
  constructor(private projectsService: ProjectsService) {}

  public transformTeamsToAllocations(teams: Team[]): Allocation[] {
    if (!teams || !Array.isArray(teams)) {
      return [];
    }
    const allocations: Allocation[] = [];
    teams.forEach(team => {
      const allocation: Allocation = {
        projectId: this.projectsService.getProjectIdByName(team.name),
        students: [],
      };
      if (team.persons && Array.isArray(team.persons)) {
        team.persons.forEach(person => {
          allocation.students.push(person.tumId);
        });
      }
      allocations.push(allocation);
    });

    return allocations;
  }
}
