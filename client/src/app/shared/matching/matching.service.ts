import { Injectable } from '@angular/core';
import { ReformatLP, Solve } from 'javascript-lp-solver';
import { Allocation } from 'src/app/api/models';
import { IdMappingService } from '../data/id-mapping.service';
import { ToastsService } from '../services/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  private readonly DELETE_PROPERTIES = ['feasible', 'bounded', 'result', 'isIntegral'];

  constructor(
    private constraintMappingService: IdMappingService,
    private toastsService: ToastsService
  ) {}

  /**
   * Asynchronously matches students to projects based on the given constraints.
   * Solves a linear program to determine the allocations.
   * If an error occurs during the solving process, a toast message is shown.
   * The constraints generated follow the format:
   * `x[numericalId of student]y[numericalId of project] + x[numericalId of student]y[numericalId of project] + ... <= [threshold]`.
   *
   * @param {string[]} constraints - An array of constraint strings, each following the specified format to apply in the linear program.
   * @returns {Promise<Allocation[]>} - A promise that resolves to an array of `Allocation` objects.
   *                                    Returns `null` if no feasible solution is found.
   *
   * @see id-mapping.service.ts for the mapping of numerical IDs to project and student IDs.
   */
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

  /**
   * Transforms the given solution into an array of allocations.
   * This method first checks if the solution is feasible. If not, it returns `null`.
   * Then, it removes specified properties from the solution object.
   * Finally, it converts the remaining solution data into an array of `Allocation` objects.
   *
   * @private
   * @param {Solve} solution - The solution object that contains the result of a linear program.
   *                           The object is expected to have keys representing variable names,
   *                           which can be split into `studentId` and `projectId`.
   * @returns {Allocation[]} - An array of `Allocation` objects if the solution is feasible,
   *                           or `null` if the solution is not feasible.
   */
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

  /**
   * Retrieves the original student or project ID corresponding to a given numerical ID.
   *
   * @private
   * @param {string} value - The numerical ID that needs to be mapped to its corresponding student or project ID.
   * @returns {string} - The original student or project ID.
   * @throws {Error} If the mapping for the provided numerical ID is undefined.
   */
  private getId(value: string): string {
    const key = this.constraintMappingService.getId(value);
    if (!key) throw new Error(`Key for value "${value}" is undefined`);
    return key;
  }
}
