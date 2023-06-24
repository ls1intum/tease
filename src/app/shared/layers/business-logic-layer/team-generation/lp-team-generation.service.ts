import { TeamGenerationService } from './team-generation.service';
import { Project } from '../../../models/project';
import { Injectable } from '@angular/core';
import { ProjectHelper } from '../../../helpers/project.helper';
import { ConstraintService } from '../constraint.service';
import { MacDeviceConstraint } from '../../../models/constraints/mac-device.constraint';
import { FemalePersonConstraint } from '../../../models/constraints/female-person.constraint';
import { IosDeviceConstraint } from '../../../models/constraints/ios-device.constraint';
import { TeamSizeConstraint } from '../../../models/constraints/team-size.constraint';
import { Device } from '../../../models/device';
import { Student, Gender } from '../../../models/student';
import { ReformatLP, Solve } from 'javascript-lp-solver';
import { SkillLevel } from '../../../models/skill';
import { SkillExpertConstraint } from '../../../models/constraints/skill-expert.constraint';
import { SkillAdvancedConstraint } from '../../../models/constraints/skill-advanced.constraint';
import { SkillNormalConstraint } from '../../../models/constraints/skill-normal.constraint';
import { SkillNoviceConstraint } from '../../../models/constraints/skill-novice.constraint';

function scaleObjective(objective, factor) {
  const parts = objective.split(' ');
  // Simply multiply each number by 'factor'
  for (let i = 0; i < parts.length; i++) {
    if (+parts[i] == parts[i]) {
      // If proper number
      parts[i] = parts[i] * factor;
    }
  }
  return parts.join(' ');
}

function groupLikeTerms(objective) {
  // Assuming proper form: [d xiyj (+ d xiyj)*]
  const parts = objective.split(' ');

  const q: { [id: string]: number } = {};
  for (let i = 0; i < parts.length; i++) {
    if (+parts[i] == parts[i]) {
      // proper number
      // sum it up with other quotients for the corresponding variable
      const varName = parts[i + 1];
      q[varName] = (q[varName] || 0) + +parts[i];
    }
  }
  // Re-assemble the objective string
  let obj = '';
  for (const varName in q) {
    const quot = q[varName];
    if (obj) {
      obj += ' + ';
    }
    obj += quot + ' ' + varName;
  }
  return obj;
}

@Injectable()
export class LPTeamGenerationService implements TeamGenerationService {
  constructor(private constraintService: ConstraintService) {}

  private generateMacDeviceConstraints(
    constraint: MacDeviceConstraint,
    teamIndex: number,
    persons: Student[]
  ): string[] {
    const minMacsPerTeam = constraint.getMinValue() || 0;
    const constraints = [];

    let c = '';

    for (let i = 1; i <= persons.length; i++) {
      const person = persons[i - 1];
      if (person.devices && person.devices.length > 0) {
        // If has a mac, add him to constraint
        const macCount = person.devices.filter(device => {
          return device === Device.Mac;
        }).length;

        if (macCount > 0) {
          if (c) {
            c += ' + ';
          }
          c += macCount + ' x' + i + 'y' + (teamIndex + 1);
        }
      }
    }

    if (c) {
      c += ' >= ' + minMacsPerTeam;
      constraints.push(c);
    }

    return constraints;
  }

  private generateIosDeviceConstraints(
    constraint: IosDeviceConstraint,
    teamIndex: number,
    persons: Student[]
  ): string[] {
    const minIosDevicesPerTeam = constraint.getMinValue() || 0;
    const constraints = [];

    let c = '';

    for (let i = 1; i <= persons.length; i++) {
      const person = persons[i - 1];
      if (person.devices && person.devices.length > 0) {
        // If has at least one iOS Device, add him to constraint
        const iosDevicesCount = person.devices.filter(device => {
          return [Device.Ipad, Device.Iphone, Device.IphoneAR, Device.IpadAR].includes(device);
        }).length;

        if (iosDevicesCount > 0) {
          // we only care whether they have at least one device
          const realIosDevicesCount = 1;
          if (c) {
            c += ' + ';
          }
          c += realIosDevicesCount + ' x' + i + 'y' + (teamIndex + 1);
        }
      }
    }

    if (c) {
      c += ' >= ' + minIosDevicesPerTeam;
      constraints.push(c);
    }

    return constraints;
  }

  private generateTeamSizeConstraints(constraint: TeamSizeConstraint, teamIndex: number, persons: Student[]): string[] {
    const minPeoplePerTeam = constraint.getMinValue() || 0;
    const maxPeoplePerTeam = constraint.getMaxValue() || persons.length;
    const constraints = [];

    let c = '';

    for (let i = 1; i <= persons.length; i++) {
      if (c) {
        c += ' + ';
      }
      c += 'x' + i + 'y' + (teamIndex + 1);
    }

    if (c) {
      constraints.push(c + ' <= ' + maxPeoplePerTeam);
      constraints.push(c + ' >= ' + minPeoplePerTeam);
    }

    return constraints;
  }

  private generateFemalePersonConstraints(
    constraint: FemalePersonConstraint,
    teamIndex: number,
    persons: Student[]
  ): string[] {
    const minFemalesPerTeam = constraint.getMinValue() || 0;
    const constraints = [];

    let c = '';

    for (let i = 1; i <= persons.length; i++) {
      if (persons[i - 1].gender === Gender.Female) {
        if (c) {
          c += ' + ';
        }
        c += 'x' + i + 'y' + (teamIndex + 1);
      }
    }

    if (c) {
      c += ' >= ' + minFemalesPerTeam;
      constraints.push(c);
    }

    return constraints;
  }

  private generateSkillLevelConstraints(
    constraint: TeamSizeConstraint,
    teamIndex: number,
    persons: Student[],
    skillLevel: SkillLevel
  ): string[] {
    const minPeoplePerTeam = constraint.getMinValue() || 0;
    const maxPeoplePerTeam = constraint.getMaxValue() || persons.length;
    const constraints = [];

    let c = '';

    for (let i = 1; i <= persons.length; i++) {
      if (persons[i - 1].supervisorAssessment === skillLevel) {
        if (c) {
          c += ' + ';
        }
        c += 'x' + i + 'y' + (teamIndex + 1);
      }
    }

    if (c) {
      constraints.push(c + ' <= ' + maxPeoplePerTeam);
      constraints.push(c + ' >= ' + minPeoplePerTeam);
    }

    return constraints;
  }

  /**
   * Distributes persons to teams according to set constraints.
   *
   * @param {Project[]} teams that the persons are distributed to, can be prepopulated
   * @returns {Promise<boolean>} that indicates if a feasible solution was found
   * else.
   */
  generate(persons: Student[], teams: Project[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log('Generating teams using linear approach...');

      let model = [];

      // Make sure already assigned team members stay in that team
      for (const team of teams) {
        const assignedPersons = team.persons;
        if (assignedPersons.length > 0) {
          const assignedPersonsIndices = [];
          const assignedTeamIndex = teams.indexOf(team);
          for (const person of assignedPersons) {
            const personIndex = persons.indexOf(person);
            const c = 'x' + (personIndex + 1) + 'y' + (assignedTeamIndex + 1) + ' = 1';
            model.push(c);
            console.log(
              person.firstName +
                ' ' +
                person.lastName +
                ' will stay assigned to team ' +
                team.name +
                '. Constraint: ' +
                c
            );
          }
        }
      }

      // Ensure binary variables
      for (let i = 1; i <= persons.length; i++) {
        for (let j = 1; j <= teams.length; j++) {
          const v = 'x' + i + 'y' + j;
          model.push(v + ' >= 0');
          model.push(v + ' <= 1');
          model.push('int ' + v); // ensures it's an integer
        }
      }

      // Ensure one team per person
      for (let i = 1; i <= persons.length; i++) {
        let c = '';
        for (let j = 1; j <= teams.length; j++) {
          if (c) {
            c += ' + ';
          }
          c += 'x' + i + 'y' + j;
        }
        c += ' = 1';
        model.push(c);
      }

      const teamIndex = {}; // j lookup
      for (let j = 0; j < teams.length; j++) {
        teamIndex[teams[j].name] = j + 1;
      }

      let prioritiesObjective = '';
      for (let i = 1; i <= persons.length; i++) {
        const person = persons[i - 1];
        const priorities = person.teamPriorities;
        for (let k = 0, v = priorities.length; k < priorities.length; k++, v--) {
          if (prioritiesObjective) {
            prioritiesObjective += ' + ';
          }
          const j = teamIndex[priorities[k].name];
          prioritiesObjective += v + ' x' + i + 'y' + j;
        }
      }

      // TODO: this skillset objective does not work. Redesign / re-think it
      const desiredSkillWeights = {};
      desiredSkillWeights[SkillLevel.VeryHigh] = 0.05;
      desiredSkillWeights[SkillLevel.High] = 0.15;
      desiredSkillWeights[SkillLevel.Medium] = 0.5;
      desiredSkillWeights[SkillLevel.Low] = 0.3;
      desiredSkillWeights[SkillLevel.None] = 0;

      let skillSetObjective = '';
      for (let j = 1; j <= teams.length; j++) {
        for (let i = 1; i <= persons.length; i++) {
          const person = persons[i - 1];
          if (person.hasSupervisorAssessment()) {
            if (skillSetObjective) {
              skillSetObjective += ' + ';
            }
            skillSetObjective += desiredSkillWeights[person.supervisorAssessment] + ' x' + i + 'y' + j;
          }
        }
      }

      // TODO: provide UI for specifying weights
      // For now, specify weights manually
      // Note: set weight to zero to ignore it
      const prioritiesObjectiveWeight = 1.0;
      const skillSetObjectiveWeight = 0.0;

      // objective function
      const objective = groupLikeTerms(
        [
          scaleObjective(prioritiesObjective, prioritiesObjectiveWeight),
          scaleObjective(skillSetObjective, skillSetObjectiveWeight),
        ].join(' + ')
      );

      model.push('max: ' + objective);

      // generate user-specified constraints
      const promises = [];
      teams.forEach((team, teamIndex) => {
        const promise = this.constraintService.getApplicableConstraints(team).then(constraints => {
          // Device constraints
          constraints.forEach(constraint => {
            let cs = [];

            if (constraint instanceof MacDeviceConstraint) {
              cs = this.generateMacDeviceConstraints(constraint, teamIndex, persons);
            }
            if (constraint instanceof IosDeviceConstraint) {
              cs = this.generateIosDeviceConstraints(constraint, teamIndex, persons);
            }
            if (constraint instanceof TeamSizeConstraint) {
              cs = this.generateTeamSizeConstraints(constraint, teamIndex, persons);
            }
            if (constraint instanceof FemalePersonConstraint) {
              cs = this.generateFemalePersonConstraints(constraint, teamIndex, persons);
            }

            if (constraint instanceof SkillExpertConstraint) {
              cs = this.generateSkillLevelConstraints(constraint, teamIndex, persons, SkillLevel.VeryHigh);
            }
            if (constraint instanceof SkillAdvancedConstraint) {
              cs = this.generateSkillLevelConstraints(constraint, teamIndex, persons, SkillLevel.High);
            }
            if (constraint instanceof SkillNormalConstraint) {
              cs = this.generateSkillLevelConstraints(constraint, teamIndex, persons, SkillLevel.Medium);
            }
            if (constraint instanceof SkillNoviceConstraint) {
              cs = this.generateSkillLevelConstraints(constraint, teamIndex, persons, SkillLevel.Low);
            }

            model = model.concat(cs);
          });
        });

        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        // Reformat to JSON model
        const formattedModel = ReformatLP(model);

        // Solve the model
        const solution = new Solve(formattedModel);

        if (solution.feasible) {
          console.log('Found a solution! Showing the assignment.');
          // clear all teams
          teams.forEach(team => team.clear());
          // Assign the teams according to results
          for (let i = 1; i <= persons.length; i++) {
            const person = persons[i - 1];
            for (let j = 1; j <= teams.length; j++) {
              const varName = 'x' + i + 'y' + j;
              const val = solution[varName] || 0;

              if (val === 1) {
                teams[j - 1].add(person);
                break;
              }
            }
          }

          resolve(true);
        } else {
          console.log('No solution was found with the given constraints. Reverted assignment to last state.');

          resolve(false);
        }
      });
    });
  }
}
