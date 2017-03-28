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

function generateExtraConstraints(realTeams, persons) {
  let minPeoplePerTeam = 7;
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

@Injectable()
export class LPTeamGenerationService implements TeamGenerationService {
  constraints: Constraint[];

  constructor(private constraintService: ConstraintService) {
    this.constraints = this.constraintService.fetchConstraints();
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
            if (macCount > 1) {
              c += macCount + ' * ';
            }
            c += 'x' + i + 'y' + j;
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
            if (iosDevicesCount > 1) {
              c += iosDevicesCount + ' * ';
            }
            c += 'x' + i + 'y' + j;
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
        c += ' <= ' + maxPeoplePerTeam;
        constraints.push(c);
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

    let model = [];

    console.log('Generating teams using linear approach...');

    let activeConstraints = this.constraints.filter(constraint => {
      return constraint.isEnabled;
    });

    let persons = TeamHelper.getPersons(teams);

    teams.forEach(team => team.clear());
    let realTeams = teams.filter(team => team.name !== Team.OrphanTeamName);

    // Ensure 'binary' variables
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
        // simplex.addConstraint(c);
        model.push(c);
      });

    });

    // Extra constraints
    {
      let cs = generateExtraConstraints(realTeams, persons);
      cs.forEach(c => {
        model.push(c);
      });
    }

    let objective = ''; // objective function

    let teamIndex = {}; // j lookup
    for (let j = 0; j < realTeams.length; j++) {
      teamIndex[realTeams[j].name] = j + 1;
    }

    for (let i = 1; i <= persons.length; i++) {
      let person = persons[i - 1];
      let priorities = person.teamPriorities;
      for (let k = 0, v = priorities.length; k < priorities.length; k++, v--) {
        if (objective) {
          objective += ' + ';
        }
        let j = teamIndex[priorities[k].name];
        objective += v + ' x' + i + 'y' + j;
      }
    }

    model.push('max: ' + objective);

    return new Promise(function (resolve, reject) {

      // Reformat to JSON model
      let formattedModel = ReformatLP(model);

      // Solve the model
      let results = Solve(formattedModel);

      console.log('Model:', model);
      console.log('Results:', results);

      // Assign the teams according to results
      for (let i = 1; i <= persons.length; i++) {
        let person = persons[i - 1];
        for (let j = 1; j <= realTeams.length; j++) {
          let varName = 'x' + i + 'y' + j;
          if (results[varName] == 1) {
            realTeams[j - 1].add(person);
            break;
          }
        }
      }

      resolve(realTeams);
    });

  }
}
