import { Injectable } from '@angular/core';
import { ReformatLP, Solve } from 'javascript-lp-solver';
import { Allocation, Student } from 'src/app/api/models';
import { ConstraintMappingService } from '../data/constraint-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class MatchingService {
  constructor(private constraintMappingService: ConstraintMappingService) {}

  async getMatching(constraints: string[], students: Student[]) {
    constraints.push(this.createCostFunction(students));
    const c = this.createOnePersonOneProjectConstraint(students);
    constraints.push(...c);
    const intConstraints = this.createIntConstraints(students);
    constraints.push(...intConstraints);

    console.log(constraints);

    const startTime = Date.now();
    console.log(await this.solveLP(constraints));
    const endTime = Date.now();

    const timeTaken = endTime - startTime; // time in milliseconds
    console.log(`Time taken by solveLP: ${timeTaken} ms`);
  }

  async solveLP(constraints: any): Promise<Allocation[]> {
    const lp = new ReformatLP(constraints);
    console.log(lp);
    return new Promise((resolve, reject) => {
      try {
        const result = new Solve(lp);
        console.log(result);
        delete result['feasible'];
        delete result['bounded'];
        delete result['result'];
        delete result['isIntegral'];

        const keys = Object.keys(result);
        console.log(keys);

        const allocations: Allocation[] = [];

        keys.forEach(key => {
          const { studentId, projectId } = this.splitVariable(key);

          let allocation = allocations.find(a => a.projectId === projectId);

          if (!allocation) {
            allocation = { projectId, students: [] };
            allocations.push(allocation);
          }

          allocation.students.push(studentId);
        });

        resolve(allocations);
      } catch (error) {
        reject(error);
      }
    });
  }

  private splitVariable(variable: string): { studentId: string; projectId: string } {
    const split = variable.split('y');
    return { studentId: this.getId(split[0].slice(1)), projectId: this.getId(split[1]) };
  }

  private getId(value: string): string {
    const key = this.constraintMappingService.getKey(value);
    if (key === undefined) {
      throw new Error(`Key for value "${value}" is undefined`);
    }
    return key;
  }

  private createCostFunction(students: Student[]): string {
    return (
      'max: ' +
      students
        .flatMap(student => {
          length = student.projectPreferences.length;
          return student.projectPreferences.map(projectPreference => {
            return (
              length -
              projectPreference.priority +
              ' x' +
              this.constraintMappingService.getNumber(student.id) +
              'y' +
              this.constraintMappingService.getNumber(projectPreference.projectId)
            );
          });
        })
        .join(' + ')
    );
  }

  private createOnePersonOneProjectConstraint(students: Student[]): string[] {
    return students.map(student => {
      return (
        student.projectPreferences
          .map(projectPreference => {
            return (
              'x' +
              this.constraintMappingService.getNumber(student.id) +
              'y' +
              this.constraintMappingService.getNumber(projectPreference.projectId)
            );
          })
          .join(' + ') + ' = 1'
      );
    });
  }

  private createIntConstraints(students: Student[]): string[] {
    return students.flatMap(student => {
      return student.projectPreferences.map(projectPreference => {
        return (
          'int x' +
          this.constraintMappingService.getNumber(student.id) +
          'y' +
          this.constraintMappingService.getNumber(projectPreference.projectId)
        );
      });
    });
  }
}
