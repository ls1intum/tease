import {TeamGenerationService} from "./team-generation.service";
import {Team} from "../../../models/team";
import {Injectable} from "@angular/core";
import {TeamHelper} from "../../../helpers/team.helper";

import {ConstraintService} from "../constraint.service";
import {Constraint} from "../../../models/constraints/constraint";
import {MacDeviceConstraint} from "../../../models/constraints/mac-device.constraint";
import {FemalePersonConstraint} from "../../../models/constraints/female-person.constraint";
import {IosDeviceConstraint} from "../../../models/constraints/ios-device.constraint";
import {TeamSizeConstraint} from "../../../models/constraints/team-size.constraint";
import {DeviceType} from "../../../models/device";
import {Person, Gender} from "../../../models/person";

import {ReformatLP, Solve} from "javascript-lp-solver";
import {SkillLevel} from "../../../models/skill";

function scaleObjective(objective, factor) {
  let parts = objective.split(' ');
  // Simply multiply each number by 'factor'
  for (let i = 0; i < parts.length; i++) {
    if (+parts[i] == parts[i]) { // If proper number
      parts[i] = parts[i] * factor;
    }
  }
  return parts.join(' ');
}

function groupLikeTerms(objective) {
  // Assuming proper form: [d xiyj (+ d xiyj)*]
  let parts = objective.split(' ');

  let q: { [id: string]: number } = {};
  for (let i = 0; i < parts.length; i++) {
    if (+parts[i] == parts[i]) { // proper number
      // sum it up with other quotients for the corresponding variable
      let varName = parts[i + 1];
      q[varName] = (q[varName] || 0) + +parts[i];
    }
  }
  // Re-assemble the objective string
  let obj = '';
  for (let varName in q) {
    let quot = q[varName];
    if (obj) {
      obj += ' + ';
    }
    obj += quot + ' ' + varName;
  }
  return obj;
}

@Injectable()
export class LPTeamGenerationService implements TeamGenerationService {

  constructor(private constraintService: ConstraintService) {
  }

  private generateMacDeviceConstraints(constraint: MacDeviceConstraint, realTeams: Team[], persons: Person[]): string[] {
    let minMacsPerTeam = constraint.getMinValue() || 0;
    let constraints = [];

    for (let j = 1; j <= realTeams.length; j++) {
      let c = '';

      for (let i = 1; i <= persons.length; i++) {
        let person = persons[i - 1];
        if (person.devices && person.devices.length > 0) {
          // If has a mac, add him to constraint
          let macCount = person.devices.filter(device => {
            return device.deviceType === DeviceType.Mac;
          }).length;

          if (macCount > 0) {
            if (c) {
              c += ' + ';
            }
            c += macCount + ' x' + i + 'y' + j;
          }
        }
      }

      if (c) {
        c += ' >= ' + minMacsPerTeam;
        constraints.push(c);
      }
    }
    return constraints;
  }

  private generateIosDeviceConstraints(constraint: IosDeviceConstraint, realTeams: Team[], persons: Person[]): string[] {
    let minIosDevicesPerTeam = constraint.getMinValue() || 0;
    let constraints = [];

    for (let j = 1; j <= realTeams.length; j++) {
      let c = '';

      for (let i = 1; i <= persons.length; i++) {
        let person = persons[i - 1];
        if (person.devices && person.devices.length > 0) {
          // If has a mac, add him to constraint
          let iosDevicesCount = person.devices.filter(device => {
            return [
              DeviceType.Ipad, DeviceType.Ipod, DeviceType.Iphone
            ].includes(device.deviceType);
          }).length;

          if (iosDevicesCount > 0) {
            if (c) {
              c += ' + ';
            }
            c += iosDevicesCount + ' x' + i + 'y' + j;
          }
        }
      }

      if (c) {
        c += ' >= ' + minIosDevicesPerTeam;
        constraints.push(c);
      }
    }
    return constraints;
  }

  private generateTeamSizeConstraints(constraint: TeamSizeConstraint, realTeams: Team[], persons: Person[]): string[] {
    let minPeoplePerTeam = constraint.getMinValue() || 0;
    let maxPeoplePerTeam = constraint.getMaxValue() || persons.length;
    let constraints = [];

    for (let j = 1; j <= realTeams.length; j++) {
      let c = '';

      for (let i = 1; i <= persons.length; i++) {
        if (c) {
          c += ' + ';
        }
        c += 'x' + i + 'y' + j;
      }

      if (c) {
        constraints.push(c + ' <= ' + maxPeoplePerTeam);
        constraints.push(c + ' >= ' + minPeoplePerTeam);

      }
    }
    return constraints;
  }

  private generateFemalePersonConstraints(constraint: FemalePersonConstraint, realTeams: Team[], persons: Person[]): string[] {
    let minFemalesPerTeam = constraint.getMinValue() || 0;
    let constraints = [];

    for (let j = 1; j <= realTeams.length; j++) {
      let c = '';

      for (let i = 1; i <= persons.length; i++) {
        if (persons[i - 1].gender === Gender.Female) {
          if (c) {
            c += ' + ';
          }
          c += 'x' + i + 'y' + j;
        }
      }

      if (c) {
        c += ' >= ' + minFemalesPerTeam;
        constraints.push(c);
      }
    }
    return constraints;
  }

  generate(teams: Team[]): Promise<Team[]> {

    return new Promise((resolve, reject) => {

      this.constraintService.fetchConstraints().then(constraints => {

        let model = [];

        console.log('Generating teams using linear approach...');

        let activeConstraints = constraints.filter(constraint => {
          return constraint.isEnabled;
        });

        let persons = TeamHelper.getPersons(teams);

        teams.forEach(team => team.clear());
        let realTeams = teams.filter(team => team.name !== Team.OrphanTeamName);

        // Ensure binary variables
        for (let i = 1; i <= persons.length; i++) {
          for (let j = 1; j <= realTeams.length; j++) {
            let v = 'x' + i + 'y' + j;
            model.push(v + ' >= 0');
            model.push(v + ' <= 1');
            model.push('int ' + v); // ensures it's an integer
          }
        }

        // Ensure one team per person
        for (let i = 1; i <= persons.length; i++) {
          let c = '';
          for (let j = 1; j <= realTeams.length; j++) {
            if (c) {
              c += ' + ';
            }
            c += 'x' + i + 'y' + j;
          }
          c += ' = 1';
          model.push(c);
        }

        // Device constraints
        activeConstraints.forEach(constraint => {

          let cs = [];

          if (constraint instanceof MacDeviceConstraint) {
            cs = this.generateMacDeviceConstraints(constraint, realTeams, persons);
          }
          if (constraint instanceof IosDeviceConstraint) {
            cs = this.generateIosDeviceConstraints(constraint, realTeams, persons);
          }
          if (constraint instanceof TeamSizeConstraint) {
            cs = this.generateTeamSizeConstraints(constraint, realTeams, persons);
          }
          if (constraint instanceof FemalePersonConstraint) {
            cs = this.generateFemalePersonConstraints(constraint, realTeams, persons);
          }

          cs.forEach(c => {
            model.push(c);
          });

        });

        let teamIndex = {}; // j lookup
        for (let j = 0; j < realTeams.length; j++) {
          teamIndex[realTeams[j].name] = j + 1;
        }

        let prioritiesObjective = '';
        for (let i = 1; i <= persons.length; i++) {
          let person = persons[i - 1];
          let priorities = person.teamPriorities;
          for (let k = 0, v = priorities.length; k < priorities.length; k++, v--) {
            if (prioritiesObjective) {
              prioritiesObjective += ' + ';
            }
            let j = teamIndex[priorities[k].name];
            prioritiesObjective += v + ' x' + i + 'y' + j;
          }
        }

        // TODO: this skillset objective does not work. Redesign / re-think it
        let desiredSkillWeights = {};
        desiredSkillWeights[SkillLevel.VeryHigh] = 0.05;
        desiredSkillWeights[SkillLevel.High] = 0.15;
        desiredSkillWeights[SkillLevel.Medium] = 0.5;
        desiredSkillWeights[SkillLevel.Low] = 0.3;
        desiredSkillWeights[SkillLevel.None] = 0;

        let skillSetObjective = '';
        for (let j = 1; j <= realTeams.length; j++) {
          // let c = '';

          for (let i = 1; i <= persons.length; i++) {
            let person = persons[i - 1];
            if (person.hasSupervisorRating()) {
              if (skillSetObjective) {
                skillSetObjective += ' + ';
              }
              skillSetObjective += desiredSkillWeights[person.supervisorRating] + ' x' + i + 'y' + j;
            }
          }
        }

        // TODO: provide UI for specifying weights
        // For now, specify weights manually
        // Note: set weight to zero to ignore it
        let prioritiesObjectiveWeight = 1.0;
        let skillSetObjectiveWeight = 0.0;

        // objective function
        let objective = groupLikeTerms([
          scaleObjective(prioritiesObjective, prioritiesObjectiveWeight),
          scaleObjective(skillSetObjective, skillSetObjectiveWeight)
        ].join(' + '));

        model.push('max: ' + objective);

        // Reformat to JSON model
        let formattedModel = ReformatLP(model);

        // Solve the model
        let solution = Solve(formattedModel);

        if (solution.feasible) {
          // Assign the teams according to results
          for (let i = 1; i <= persons.length; i++) {
            let person = persons[i - 1];
            for (let j = 1; j <= realTeams.length; j++) {
              let varName = 'x' + i + 'y' + j;
              let val = solution[varName] || 0;

              if (val === 1) {
                realTeams[j - 1].add(person);
                break;
              }
            }
          }
        } else {
          // Assign all to the 'orphan' team, otherwise they are Person objects are simply lost
          let orphanTeam = teams.filter(team => team.name === Team.OrphanTeamName)[0];
          for (let i = 0; i < persons.length; i++) {
            orphanTeam.add(persons[i]);
          }
        }

        resolve(teams);

      })
    });

  }
}
