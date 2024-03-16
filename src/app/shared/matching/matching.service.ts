import { Injectable } from '@angular/core';
import { ReformatLP, Solve } from 'javascript-lp-solver';
import { Allocation, Student } from 'src/app/api/models';
import { ConstraintMappingService } from '../data/constraint-mapping.service';
import { ToastsService } from '../services/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  private readonly DELETE_PROPERTIES = ['feasible', 'bounded', 'result', 'isIntegral'];

  constructor(
    private constraintMappingService: ConstraintMappingService,
    private toastsService: ToastsService
  ) {}

  async getAllocations(constraints: string[]): Promise<Allocation[]> {
    try {
      const startTime = Date.now();
      const allocations = await this.solveLinearProgram(constraints);
      const endTime = Date.now();
      console.log(`Time taken by solveLP: ${endTime - startTime} ms`);
      return allocations;
    } catch (error) {
      this.toastsService.showToast('No feasible solution found', 'Error', false);
    }
    return null;
  }

  private async solveLinearProgram(constraints: string[]): Promise<Allocation[]> {
    return new Promise((resolve, reject) => {
      try {
        const reformattedLinearProgram: ReformatLP = new ReformatLP(constraints);
        const solution = new Solve(reformattedLinearProgram);
        const allocations = this.transformSolutionToAllocations(solution);
        if (!allocations) reject();
        resolve(allocations);
      } catch (error) {
        reject(error);
      }
    });
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
      const allocation = allocations.find(allocation => allocation.projectId === projectId);
      if (allocation) {
        allocation.students.push(studentId);
      } else {
        allocations.push({ projectId: projectId, students: [studentId] });
      }
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
