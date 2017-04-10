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
import {ToolbarService} from "../../../ui/toolbar.service";
import {SkillLevel} from "../../../models/skill";

function generateExtraConstraints(realTeams, persons) {
  let minPeoplePerTeam = 6;
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
      c += ' >= ' + minPeoplePerTeam;
      constraints.push(c);
    }
  }
  return constraints;
}

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
  constraints: Constraint[];

  constructor(private constraintService: ConstraintService, private toolbarService: ToolbarService) {
    this.constraints = this.constraintService.fetchConstraints();
    this.toolbarService = toolbarService;
  }

  private generateMacDeviceConstraints(constraint: MacDeviceConstraint, realTeams: Team[], persons: Person[]): string[] {
    let minMacsPerTeam = constraint.minimumCount || 0;
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
    let minIosDevicesPerTeam = constraint.minimumCount || 0;
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
    let maxPeoplePerTeam = constraint.maximumCount || persons.length;
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
        // c += ' <= ' + maxPeoplePerTeam;
        constraints.push(c + ' <= ' + maxPeoplePerTeam);
        // TODO: integrate with UI properly
        // constraints.push(c + ' >= ' + (maxPeoplePerTeam - 1));
        // constraints.push(c + ' >= ' + (7));

      }
    }
    return constraints;
  }

  private generateFemalePersonConstraints(constraint: FemalePersonConstraint, realTeams: Team[], persons: Person[]): string[] {
    let minFemalesPerTeam = constraint.minimumCount || 0;
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

    let DEBUG = {// TODO: get rid of
      constraints: [],
      objective: ''
    };

    let model = [];

    console.log('Generating teams using linear approach...');

    let activeConstraints = this.constraints.filter(constraint => {
      return constraint.isEnabled;
    });

    let persons = TeamHelper.getPersons(teams);
    console.log('PERSONS:', persons);
    console.log('Supervisor Ratings:', persons.map(x => x.supervisorRating));

    teams.forEach(team => team.clear());
    let realTeams = teams.filter(team => team.name !== Team.OrphanTeamName);

    console.log('Team names:', realTeams.map(x => x.name));

    // Ensure 'binary' variables
    for (let i = 1; i <= persons.length; i++) {
      for (let j = 1; j <= realTeams.length; j++) {
        let v = 'x' + i + 'y' + j;
        model.push(v + ' >= 0');
        model.push(v + ' <= 1');
        model.push('int ' + v); // ensures it's an integer

        DEBUG.constraints.push(v + ' >= 0');
        DEBUG.constraints.push(v + ' <= 1');
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
      DEBUG.constraints.push(c);
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

      DEBUG.constraints = DEBUG.constraints.concat(cs);

    });

    // Extra constraints
    // {
    //   let cs = generateExtraConstraints(realTeams, persons);
    //   cs.forEach(c => {
    //     model.push(c);
    //   });
    //
    //   DEBUG.constraints = DEBUG.constraints.concat(cs);
    // }

    let objective = ''; // objective function

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

    let scalarizedMultipleObjectives = false;
    console.log('skillSetObjective:', skillSetObjective);
    if (scalarizedMultipleObjectives) {
      objective = groupLikeTerms(scaleObjective(prioritiesObjective, 1) + ' + ' + scaleObjective(skillSetObjective, 100));
      // objective = scaleObjective(skillSetObjective, 10000000);
    } else {
      objective = prioritiesObjective;
    }

    console.log('OBJECTIVE:', objective);
    model.push('max: ' + objective);

    // Reformat to JSON model
    let formattedModel = ReformatLP(model);

    // Solve the model
    let results = Solve(formattedModel);

    console.log('Model:', model);
    console.log('Results:', results);

    let totalScore = 0;

    DEBUG.objective = objective;

    let geval = eval;

    // Assign the teams according to results
    for (let i = 1; i <= persons.length; i++) {
      let person = persons[i - 1];
      for (let j = 1; j <= realTeams.length; j++) {
        let varName = 'x' + i + 'y' + j;

        // TODO: remove
        // let val = xxx[varName] || 0;
        let val = results[varName] || 0;
        // console.log('??? ' + 'var ' + varName + ' = ' + val);
        geval('var ' + varName + ' = ' + val);

        if (results[varName] == 1) {
          // if (xxx[varName] == 1) {
          realTeams[j - 1].add(person);
          let priority = person.teamPriorities
            .map(x => x.name)
            .indexOf(realTeams[j - 1].name);
          let score = realTeams.length - priority;

          // console.log('score:', varName, realTeams[j - 1].name, priority, score);

          totalScore += score;
        }
      }
    }

    // for (let j = 0; j < qs.length; j++) {
    //   console.log('------->', j, geval(qs[j]));
    // }
    // for (let j = 0; j < DEBUG.constraints.length; j++) {
    //   console.log('------->', j, geval(DEBUG.constraints[j]) ? true : DEBUG.constraints[j]);
    // }
    // for (let j = 0; j < DEBUG.constraints.length; j++) {
    //   console.log(DEBUG.constraints[j]);
    // }

    this.toolbarService.setTotalScore(results.feasible ? totalScore : -1);

    return Promise.resolve(realTeams);
    // return new Promise(function (){});

  }
}
