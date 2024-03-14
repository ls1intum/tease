import { Injectable } from '@angular/core';
import { ReformatLP, Solve } from 'javascript-lp-solver';
import { Allocation, Student } from 'src/app/api/models';
import { ConstraintMappingService } from '../data/constraint-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  private readonly DELETE_PROPERTIES = ['feasible', 'bounded', 'result', 'isIntegral'];

  constructor(private constraintMappingService: ConstraintMappingService) {}

  async getAllocations(constraints: string[]): Promise<Allocation[]> {
    try {
      const startTime = Date.now();
      const allocations = await this._getAllocations(constraints);
      const endTime = Date.now();
      console.log(`Time taken by solveLP: ${endTime - startTime} ms`);
      return allocations;
    } catch (error) {
      console.log('Error');
    }
    return null;
  }

  private async _getAllocations(constraints: string[]): Promise<Allocation[]> {
    return new Promise((resolve, reject) => {
      try {
        const solution = this.solveLinearProgram(constraints);
        const allocations = this.transformSolutionToAllocations(solution);
        if (!allocations) reject();
        resolve(allocations);
      } catch (error) {
        reject(error);
      }
    });
  }

  private solveLinearProgram(constraints: string[]): Solve {
    const reformattedLinearProgram: ReformatLP = new ReformatLP(constraints);
    return new Solve(reformattedLinearProgram);
  }

  private transformSolutionToAllocations(solution: Solve): Allocation[] {
    if (!solution.feasible) return null;

    for (const property of this.DELETE_PROPERTIES) {
      delete solution[property];
    }
    const keys = Object.keys(solution);
    const allocations: Allocation[] = [];

    keys.forEach(key => {
      const { studentId, projectId } = this.splitVariable(key);
      let allocation = allocations.find(allocation => allocation.projectId === projectId);
      if (!allocation) allocations.push({ projectId: projectId, students: [studentId] });
      else allocation.students.push(studentId);
    });

    return allocations;
  }

  private splitVariable(variable: string): { studentId: string; projectId: string } {
    const split = variable.split('y');
    return { studentId: this.getId(split[0].slice(1)), projectId: this.getId(split[1]) };
  }

  private getId(value: string): string {
    const key = this.constraintMappingService.getKey(value);
    if (!key) throw new Error(`Key for value "${value}" is undefined`);
    return key;
  }
}
