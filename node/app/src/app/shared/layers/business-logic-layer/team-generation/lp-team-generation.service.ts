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
// import {ConstraintAccessService} from "../../../../shared/layers/data-access-layer/constraint.access.service";

import {ReformatLP, Solve} from "javascript-lp-solver";

// import {SimplexSolver} from "simplex-solver";
// import {maximize} from "simplex-solver/src/index.js";

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
      console.log('minPeoplePerTeam:', c);
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
        console.log('minMacsPerTeam:', c);
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

          // console.log('>>>', iosDevicesCount);

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
        console.log('minIosDevicesPerTeam:', c);
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
        console.log('Max people per team:', c);
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
        console.log('GIRLS:', c);
        constraints.push(c);
      }
    }
    return constraints;
  }

  generate(teams: Team[]): Promise<Team[]> {

    let model = [];

    // let x = ReformatLP(model);

    console.log('Generating teams using linear approach...');

    let activeConstraints = this.constraints.filter(constraint => {
      return constraint.isEnabled;
    });

    console.log('CONSTRAINTS:', activeConstraints);
    // console.log(activeConstraints[0] instanceof MacDeviceConstraint);
    // console.log(activeConstraints[0] instanceof FemalePersonConstraint);
    // console.log(activeConstraints[0] instanceof IosDeviceConstraint);
    // console.log(activeConstraints[0] instanceof TeamSizeConstraint);


    let persons = TeamHelper.getPersons(teams);

    console.log('teams:', teams);
    console.log('persons:', persons);

    teams.forEach(team => team.clear());
    let realTeams = teams.filter(team => team.name !== Team.OrphanTeamName);

    // Ensure 'binary' variables
    for (let i = 1; i <= persons.length; i++) {
      for (let j = 1; j <= realTeams.length; j++) {
        let v = 'x' + i + 'y' + j;
        // simplex.addConstraint(v + ' >= 0');
        // simplex.addConstraint(v + ' <= 1');
        model.push(v + ' >= 0');
        model.push(v + ' <= 1');
        // console.log(v + ' >= 0');
        // console.log(v + ' <= 1');
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
      // console.log('One team per person:', c);
      // simplex.addConstraint(c);
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
        // simplex.addConstraint(c);
        model.push(c);
      });
    }

    let objective = ''; // objective function

    let teamIndex = {}; // j lookup
    for (let j = 0; j < realTeams.length; j++) {
      teamIndex[realTeams[j].name] = j + 1;
    }

    let takeTopPriorities = 1; // Enforce limit on accounted priorities, otherwise the lib runs out of iterations / throws error "Objective function is unbounded in optimize"
    for (let i = 1; i <= persons.length; i++) {
      let person = persons[i - 1];
      let priorities = person.teamPriorities;
      for (let k = 0, v = priorities.length; k < Math.min(priorities.length, takeTopPriorities); k++, v--) {
        if (objective) {
          objective += ' + ';
        }
        let j = teamIndex[priorities[k].name];
        objective += v + ' * x' + i + 'y' + j;
      }
    }

    // TODO: remove this
    // works with
    // objective = '11 * x1y1 + 10 * x1y2 + 9 * x1y3 + 8 * x1y4 + 7 * x1y5 + 6 * x1y6 + 5 * x1y7 + 4 * x1y8 + 3 * x1y9 + 2 * x1y10 + 1 * x1y11 + 11 * x2y4 + 10 * x2y5 + 9 * x2y7 + 8 * x2y2 + 7 * x2y1 + 6 * x2y10 + 5 * x2y6 + 4 * x2y8 + 3 * x2y3 + 2 * x2y11 + 1 * x2y9 + 11 * x3y5 + 10 * x3y2 + 9 * x3y7 + 8 * x3y1 + 7 * x3y11 + 6 * x3y4 + 5 * x3y9 + 4 * x3y10 + 3 * x3y8 + 2 * x3y6 + 1 * x3y3 + 11 * x4y8 + 10 * x4y4 + 9 * x4y11 + 8 * x4y5 + 7 * x4y10 + 6 * x4y7 + 5 * x4y1 + 4 * x4y2 + 3 * x4y3 + 2 * x4y9 + 1 * x4y6 + 11 * x5y3 + 10 * x5y2 + 9 * x5y8 + 8 * x5y1 + 7 * x5y7 + 6 * x5y6 + 5 * x5y4 + 4 * x5y9 + 3 * x5y10 + 2 * x5y5 + 1 * x5y11 + 11 * x6y10 + 10 * x6y2 + 9 * x6y4 + 8 * x6y7 + 7 * x6y1 + 6 * x6y6 + 5 * x6y8 + 4 * x6y9 + 3 * x6y3 + 2 * x6y11 + 1 * x6y5 + 11 * x7y2 + 10 * x7y4 + 9 * x7y3 + 8 * x7y6 + 7 * x7y7 + 6 * x7y1 + 5 * x7y10 + 4 * x7y8 + 3 * x7y9 + 2 * x7y5 + 1 * x7y11 + 11 * x8y10 + 10 * x8y11 + 9 * x8y1 + 8 * x8y2 + 7 * x8y4 + 6 * x8y8 + 5 * x8y7 + 4 * x8y5 + 3 * x8y9 + 2 * x8y3 + 1 * x8y6 + 11 * x9y3 + 10 * x9y7 + 9 * x9y4 + 8 * x9y1 + 7 * x9y5 + 6 * x9y6 + 5 * x9y10 + 4 * x9y2 + 3 * x9y9 + 2 * x9y8 + 1 * x9y11 + 11 * x10y2 + 10 * x10y1 + 9 * x10y4 + 8 * x10y7 + 7 * x10y11 + 6 * x10y5 + 5 * x10y3 + 4 * x10y9 + 3 * x10y10 + 2 * x10y6 + 1 * x10y8 + 11 * x11y3 + 10 * x11y1 + 9 * x11y9 + 8 * x11y4 + 7 * x11y2 + 6 * x11y7 + 5 * x11y10 + 4 * x11y5 + 3 * x11y11 + 2 * x11y6 + 1 * x11y8 + 11 * x12y2 + 10 * x12y3 + 9 * x12y8 + 8 * x12y10 + 7 * x12y11 + 6 * x12y6 + 5 * x12y1 + 4 * x12y5 + 3 * x12y7 + 2 * x12y4 + 1 * x12y9 + 11 * x13y5 + 10 * x13y7 + 9 * x13y1 + 8 * x13y10 + 7 * x13y2 + 6 * x13y6 + 5 * x13y4 + 4 * x13y8 + 3 * x13y11 + 2 * x13y3 + 1 * x13y9 + 11 * x14y8 + 10 * x14y1 + 9 * x14y11 + 8 * x14y3 + 7 * x14y7 + 6 * x14y4 + 5 * x14y2 + 4 * x14y9 + 3 * x14y10 + 2 * x14y5 + 1 * x14y6 + 11 * x15y4 + 10 * x15y2 + 9 * x15y7 + 8 * x15y11 + 7 * x15y5 + 6 * x15y10 + 5 * x15y9 + 4 * x15y8 + 3 * x15y3 + 2 * x15y1 + 1 * x15y6 + 11 * x16y4 + 10 * x16y11 + 9 * x16y1 + 8 * x16y7 + 7 * x16y10 + 6 * x16y9 + 5 * x16y5 + 4 * x16y8 + 3 * x16y3 + 2 * x16y2 + 1 * x16y6 + 11 * x17y7 + 10 * x17y1 + 9 * x17y2 + 8 * x17y3 + 7 * x17y11 + 6 * x17y5 + 5 * x17y8 + 4 * x17y10 + 3 * x17y4 + 2 * x17y9 + 1 * x17y6 + 11 * x18y2 + 10 * x18y4 + 9 * x18y11 + 8 * x18y8 + 7 * x18y3 + 6 * x18y10 + 5 * x18y7 + 4 * x18y1 + 3 * x18y5 + 2 * x18y9 + 1 * x18y6 + 11 * x19y5 + 10 * x19y11 + 9 * x19y4 + 8 * x19y3 + 7 * x19y10 + 6 * x19y7 + 5 * x19y8 + 4 * x19y9 + 3 * x19y1 + 2 * x19y6 + 1 * x19y2 + 11 * x20y10 + 10 * x20y11 + 9 * x20y2 + 8 * x20y9 + 7 * x20y1 + 6 * x20y4 + 5 * x20y5 + 4 * x20y8 + 3 * x20y7 + 2 * x20y6 + 1 * x20y3 + 11 * x21y4 + 10 * x21y2 + 9 * x21y11 + 8 * x21y5 + 7 * x21y1 + 6 * x21y7 + 5 * x21y3 + 4 * x21y9 + 3 * x21y10 + 2 * x21y8 + 1 * x21y6 + 11 * x22y5 + 10 * x22y3 + 9 * x22y8 + 8 * x22y2 + 7 * x22y9 + 6 * x22y1 + 5 * x22y11 + 4 * x22y7 + 3 * x22y4 + 2 * x22y10 + 1 * x22y6 + 11 * x23y2 + 10 * x23y4 + 9 * x23y11 + 8 * x23y8 + 7 * x23y7 + 6 * x23y5 + 5 * x23y1 + 4 * x23y9 + 3 * x23y3 + 2 * x23y10 + 1 * x23y6 + 11 * x24y8 + 10 * x24y5 + 9 * x24y10 + 8 * x24y4 + 7 * x24y7 + 6 * x24y11 + 5 * x24y9 + 4 * x24y2 + 3 * x24y1 + 2 * x24y3 + 1 * x24y6 + 11 * x25y2 + 10 * x25y4 + 9 * x25y11 + 8 * x25y7 + 7 * x25y1 + 6 * x25y8 + 5 * x25y10 + 4 * x25y5 + 3 * x25y9 + 2 * x25y3 + 1 * x25y6 + 11 * x26y5 + 10 * x26y7 + 9 * x26y1 + 8 * x26y10 + 7 * x26y2 + 6 * x26y6 + 5 * x26y4 + 4 * x26y8 + 3 * x26y11 + 2 * x26y3 + 1 * x26y9 + 11 * x27y4 + 10 * x27y5 + 9 * x27y2 + 8 * x27y7 + 7 * x27y3 + 6 * x27y8 + 5 * x27y10 + 4 * x27y1 + 3 * x27y6 + 2 * x27y11 + 1 * x27y9 + 11 * x28y5 + 10 * x28y2 + 9 * x28y4 + 8 * x28y1 + 7 * x28y7 + 6 * x28y10 + 5 * x28y11 + 4 * x28y3 + 3 * x28y8 + 2 * x28y9 + 1 * x28y6 + 11 * x29y2 + 10 * x29y7 + 9 * x29y11 + 8 * x29y1 + 7 * x29y8 + 6 * x29y4 + 5 * x29y3 + 4 * x29y10 + 3 * x29y9 + 2 * x29y5 + 1 * x29y6 + 11 * x30y5 + 10 * x30y10 + 9 * x30y11 + 8 * x30y1 + 7 * x30y8 + 6 * x30y2 + 5 * x30y9 + 4 * x30y7 + 3 * x30y3 + 2 * x30y4 + 1 * x30y6 + 11 * x31y2 + 10 * x31y11 + 9 * x31y1 + 8 * x31y7 + 7 * x31y3 + 6 * x31y10 + 5 * x31y5 + 4 * x31y8 + 3 * x31y4 + 2 * x31y6 + 1 * x31y9 + 11 * x32y8 + 10 * x32y1 + 9 * x32y3 + 8 * x32y11 + 7 * x32y4 + 6 * x32y2 + 5 * x32y10 + 4 * x32y7 + 3 * x32y5 + 2 * x32y9 + 1 * x32y6 + 11 * x33y4 + 10 * x33y7 + 9 * x33y1 + 8 * x33y10 + 7 * x33y8 + 6 * x33y9 + 5 * x33y2 + 4 * x33y5 + 3 * x33y11 + 2 * x33y6 + 1 * x33y3 + 11 * x34y4 + 10 * x34y5 + 9 * x34y11 + 8 * x34y3 + 7 * x34y10 + 6 * x34y1 + 5 * x34y2 + 4 * x34y7 + 3 * x34y8 + 2 * x34y9 + 1 * x34y6 + 11 * x35y11 + 10 * x35y4 + 9 * x35y5 + 8 * x35y7 + 7 * x35y10 + 6 * x35y3 + 5 * x35y2 + 4 * x35y8 + 3 * x35y9 + 2 * x35y1 + 1 * x35y6 + 11 * x36y2 + 10 * x36y11 + 9 * x36y7 + 8 * x36y1 + 7 * x36y5 + 6 * x36y3 + 5 * x36y4 + 4 * x36y9 + 3 * x36y8 + 2 * x36y10 + 1 * x36y6 + 11 * x37y7 + 10 * x37y4 + 9 * x37y10 + 8 * x37y11 + 7 * x37y1 + 6 * x37y2 + 5 * x37y3 + 4 * x37y9 + 3 * x37y5 + 2 * x37y6 + 1 * x37y8 + 11 * x38y8 + 10 * x38y1 + 9 * x38y7 + 8 * x38y2 + 7 * x38y3 + 6 * x38y5 + 5 * x38y6 + 4 * x38y4 + 3 * x38y9 + 2 * x38y11 + 1 * x38y10 + 11 * x39y8 + 10 * x39y11 + 9 * x39y3 + 8 * x39y10 + 7 * x39y5 + 6 * x39y2 + 5 * x39y1 + 4 * x39y7 + 3 * x39y9 + 2 * x39y4 + 1 * x39y6 + 11 * x40y4 + 10 * x40y11 + 9 * x40y5 + 8 * x40y2 + 7 * x40y7 + 6 * x40y3 + 5 * x40y8 + 4 * x40y10 + 3 * x40y6 + 2 * x40y1 + 1 * x40y9 + 11 * x41y2 + 10 * x41y9 + 9 * x41y8 + 8 * x41y1 + 7 * x41y10 + 6 * x41y4 + 5 * x41y3 + 4 * x41y5 + 3 * x41y11 + 2 * x41y7 + 1 * x41y6 + 11 * x42y2 + 10 * x42y9 + 9 * x42y8 + 8 * x42y10 + 7 * x42y1 + 6 * x42y4 + 5 * x42y6 + 4 * x42y7 + 3 * x42y5 + 2 * x42y3 + 1 * x42y11 + 11 * x43y11 + 10 * x43y4 + 9 * x43y5 + 8 * x43y7 + 7 * x43y10 + 6 * x43y3 + 5 * x43y2 + 4 * x43y8 + 3 * x43y9 + 2 * x43y1 + 1 * x43y6 + 11 * x44y4 + 10 * x44y1 + 9 * x44y3 + 8 * x44y11 + 7 * x44y8 + 6 * x44y2 + 5 * x44y7 + 4 * x44y10 + 3 * x44y5 + 2 * x44y9 + 1 * x44y6 + 11 * x45y8 + 10 * x45y2 + 9 * x45y11 + 8 * x45y10 + 7 * x45y4 + 6 * x45y9 + 5 * x45y3 + 4 * x45y7 + 3 * x45y5 + 2 * x45y1 + 1 * x45y6 + 11 * x46y8 + 10 * x46y3 + 9 * x46y4 + 8 * x46y2 + 7 * x46y9 + 6 * x46y10 + 5 * x46y1 + 4 * x46y11 + 3 * x46y7 + 2 * x46y6 + 1 * x46y5 + 11 * x47y11 + 10 * x47y2 + 9 * x47y4 + 8 * x47y1 + 7 * x47y8 + 6 * x47y5 + 5 * x47y10 + 4 * x47y7 + 3 * x47y9 + 2 * x47y3 + 1 * x47y6 + 11 * x48y2 + 10 * x48y4 + 9 * x48y10 + 8 * x48y11 + 7 * x48y1 + 6 * x48y5 + 5 * x48y7 + 4 * x48y8 + 3 * x48y9 + 2 * x48y3 + 1 * x48y6 + 11 * x49y7 + 10 * x49y10 + 9 * x49y4 + 8 * x49y3 + 7 * x49y5 + 6 * x49y6 + 5 * x49y2 + 4 * x49y11 + 3 * x49y8 + 2 * x49y9 + 1 * x49y1 + 11 * x50y11 + 10 * x50y10 + 9 * x50y5 + 8 * x50y2 + 7 * x50y4 + 6 * x50y1 + 5 * x50y7 + 4 * x50y8 + 3 * x50y3 + 2 * x50y6 + 1 * x50y9 + 11 * x51y4 + 10 * x51y11 + 9 * x51y1 + 8 * x51y3 + 7 * x51y7 + 6 * x51y2 + 5 * x51y10 + 4 * x51y5 + 3 * x51y8 + 2 * x51y9 + 1 * x51y6 + 11 * x52y8 + 10 * x52y1 + 9 * x52y6 + 8 * x52y4 + 7 * x52y2 + 6 * x52y11 + 5 * x52y7 + 4 * x52y9 + 3 * x52y5 + 2 * x52y3 + 1 * x52y10 + 11 * x53y2 + 10 * x53y4 + 9 * x53y7 + 8 * x53y11 + 7 * x53y5 + 6 * x53y10 + 5 * x53y1 + 4 * x53y3 + 3 * x53y9 + 2 * x53y8 + 1 * x53y6 + 11 * x54y2 + 10 * x54y1 + 9 * x54y7 + 8 * x54y10 + 7 * x54y11 + 6 * x54y4 + 5 * x54y5 + 4 * x54y9 + 3 * x54y6 + 2 * x54y8 + 1 * x54y3 + 11 * x55y7 + 10 * x55y1 + 9 * x55y4 + 8 * x55y3 + 7 * x55y2 + 6 * x55y11 + 5 * x55y8 + 4 * x55y10 + 3 * x55y9 + 2 * x55y5 + 1 * x55y6 + 11 * x56y4 + 10 * x56y5 + 9 * x56y2 + 8 * x56y3 + 7 * x56y7 + 6 * x56y11 + 5 * x56y1 + 4 * x56y8 + 3 * x56y10 + 2 * x56y9 + 1 * x56y6 + 11 * x57y5 + 10 * x57y4 + 9 * x57y11 + 8 * x57y2 + 7 * x57y1 + 6 * x57y3 + 5 * x57y7 + 4 * x57y10 + 3 * x57y9 + 2 * x57y8 + 1 * x57y6 + 11 * x58y3 + 10 * x58y2 + 9 * x58y1 + 8 * x58y7 + 7 * x58y4 + 6 * x58y8 + 5 * x58y6 + 4 * x58y9 + 3 * x58y5 + 2 * x58y10 + 1 * x58y11 + 11 * x59y8 + 10 * x59y4 + 9 * x59y5 + 8 * x59y11 + 7 * x59y3 + 6 * x59y10 + 5 * x59y7 + 4 * x59y1 + 3 * x59y2 + 2 * x59y9 + 1 * x59y6 + 11 * x60y4 + 10 * x60y11 + 9 * x60y2 + 8 * x60y3 + 7 * x60y5 + 6 * x60y8 + 5 * x60y10 + 4 * x60y7 + 3 * x60y1 + 2 * x60y9 + 1 * x60y6 + 11 * x61y10 + 10 * x61y2 + 9 * x61y8 + 8 * x61y1 + 7 * x61y7 + 6 * x61y3 + 5 * x61y5 + 4 * x61y11 + 3 * x61y4 + 2 * x61y9 + 1 * x61y6 + 11 * x62y6 + 10 * x62y8 + 9 * x62y10 + 8 * x62y3 + 7 * x62y11 + 6 * x62y9 + 5 * x62y2 + 4 * x62y4 + 3 * x62y5 + 2 * x62y1 + 1 * x62y7 + 11 * x63y4 + 10 * x63y3 + 9 * x63y7 + 8 * x63y2 + 7 * x63y5 + 6 * x63y11 + 5 * x63y1 + 4 * x63y8 + 3 * x63y9 + 2 * x63y10 + 1 * x63y6 + 11 * x64y8 + 10 * x64y2 + 9 * x64y10 + 8 * x64y3 + 7 * x64y1 + 6 * x64y7 + 5 * x64y9 + 4 * x64y4 + 3 * x64y11 + 2 * x64y6 + 1 * x64y5 + 11 * x65y4 + 10 * x65y3 + 9 * x65y7 + 8 * x65y2 + 7 * x65y5 + 6 * x65y11 + 5 * x65y1 + 4 * x65y8 + 3 * x65y9 + 2 * x65y10 + 1 * x65y6 + 11 * x66y11 + 10 * x66y2 + 9 * x66y3 + 8 * x66y4 + 7 * x66y8 + 6 * x66y7 + 5 * x66y10 + 4 * x66y1 + 3 * x66y9 + 2 * x66y5 + 1 * x66y6 + 11 * x67y4 + 10 * x67y8 + 9 * x67y11 + 8 * x67y10 + 7 * x67y2 + 6 * x67y3 + 5 * x67y5 + 4 * x67y9 + 3 * x67y7 + 2 * x67y1 + 1 * x67y6 + 11 * x68y8 + 10 * x68y1';
    // doesn't work with:
    // objective = '11 * x1y1 + 10 * x1y2 + 9 * x1y3 + 8 * x1y4 + 7 * x1y5 + 6 * x1y6 + 5 * x1y7 + 4 * x1y8 + 3 * x1y9 + 2 * x1y10 + 1 * x1y11 + 11 * x2y4 + 10 * x2y5 + 9 * x2y7 + 8 * x2y2 + 7 * x2y1 + 6 * x2y10 + 5 * x2y6 + 4 * x2y8 + 3 * x2y3 + 2 * x2y11 + 1 * x2y9 + 11 * x3y5 + 10 * x3y2 + 9 * x3y7 + 8 * x3y1 + 7 * x3y11 + 6 * x3y4 + 5 * x3y9 + 4 * x3y10 + 3 * x3y8 + 2 * x3y6 + 1 * x3y3 + 11 * x4y8 + 10 * x4y4 + 9 * x4y11 + 8 * x4y5 + 7 * x4y10 + 6 * x4y7 + 5 * x4y1 + 4 * x4y2 + 3 * x4y3 + 2 * x4y9 + 1 * x4y6 + 11 * x5y3 + 10 * x5y2 + 9 * x5y8 + 8 * x5y1 + 7 * x5y7 + 6 * x5y6 + 5 * x5y4 + 4 * x5y9 + 3 * x5y10 + 2 * x5y5 + 1 * x5y11 + 11 * x6y10 + 10 * x6y2 + 9 * x6y4 + 8 * x6y7 + 7 * x6y1 + 6 * x6y6 + 5 * x6y8 + 4 * x6y9 + 3 * x6y3 + 2 * x6y11 + 1 * x6y5 + 11 * x7y2 + 10 * x7y4 + 9 * x7y3 + 8 * x7y6 + 7 * x7y7 + 6 * x7y1 + 5 * x7y10 + 4 * x7y8 + 3 * x7y9 + 2 * x7y5 + 1 * x7y11 + 11 * x8y10 + 10 * x8y11 + 9 * x8y1 + 8 * x8y2 + 7 * x8y4 + 6 * x8y8 + 5 * x8y7 + 4 * x8y5 + 3 * x8y9 + 2 * x8y3 + 1 * x8y6 + 11 * x9y3 + 10 * x9y7 + 9 * x9y4 + 8 * x9y1 + 7 * x9y5 + 6 * x9y6 + 5 * x9y10 + 4 * x9y2 + 3 * x9y9 + 2 * x9y8 + 1 * x9y11 + 11 * x10y2 + 10 * x10y1 + 9 * x10y4 + 8 * x10y7 + 7 * x10y11 + 6 * x10y5 + 5 * x10y3 + 4 * x10y9 + 3 * x10y10 + 2 * x10y6 + 1 * x10y8 + 11 * x11y3 + 10 * x11y1 + 9 * x11y9 + 8 * x11y4 + 7 * x11y2 + 6 * x11y7 + 5 * x11y10 + 4 * x11y5 + 3 * x11y11 + 2 * x11y6 + 1 * x11y8 + 11 * x12y2 + 10 * x12y3 + 9 * x12y8 + 8 * x12y10 + 7 * x12y11 + 6 * x12y6 + 5 * x12y1 + 4 * x12y5 + 3 * x12y7 + 2 * x12y4 + 1 * x12y9 + 11 * x13y5 + 10 * x13y7 + 9 * x13y1 + 8 * x13y10 + 7 * x13y2 + 6 * x13y6 + 5 * x13y4 + 4 * x13y8 + 3 * x13y11 + 2 * x13y3 + 1 * x13y9 + 11 * x14y8 + 10 * x14y1 + 9 * x14y11 + 8 * x14y3 + 7 * x14y7 + 6 * x14y4 + 5 * x14y2 + 4 * x14y9 + 3 * x14y10 + 2 * x14y5 + 1 * x14y6 + 11 * x15y4 + 10 * x15y2 + 9 * x15y7 + 8 * x15y11 + 7 * x15y5 + 6 * x15y10 + 5 * x15y9 + 4 * x15y8 + 3 * x15y3 + 2 * x15y1 + 1 * x15y6 + 11 * x16y4 + 10 * x16y11 + 9 * x16y1 + 8 * x16y7 + 7 * x16y10 + 6 * x16y9 + 5 * x16y5 + 4 * x16y8 + 3 * x16y3 + 2 * x16y2 + 1 * x16y6 + 11 * x17y7 + 10 * x17y1 + 9 * x17y2 + 8 * x17y3 + 7 * x17y11 + 6 * x17y5 + 5 * x17y8 + 4 * x17y10 + 3 * x17y4 + 2 * x17y9 + 1 * x17y6 + 11 * x18y2 + 10 * x18y4 + 9 * x18y11 + 8 * x18y8 + 7 * x18y3 + 6 * x18y10 + 5 * x18y7 + 4 * x18y1 + 3 * x18y5 + 2 * x18y9 + 1 * x18y6 + 11 * x19y5 + 10 * x19y11 + 9 * x19y4 + 8 * x19y3 + 7 * x19y10 + 6 * x19y7 + 5 * x19y8 + 4 * x19y9 + 3 * x19y1 + 2 * x19y6 + 1 * x19y2 + 11 * x20y10 + 10 * x20y11 + 9 * x20y2 + 8 * x20y9 + 7 * x20y1 + 6 * x20y4 + 5 * x20y5 + 4 * x20y8 + 3 * x20y7 + 2 * x20y6 + 1 * x20y3 + 11 * x21y4 + 10 * x21y2 + 9 * x21y11 + 8 * x21y5 + 7 * x21y1 + 6 * x21y7 + 5 * x21y3 + 4 * x21y9 + 3 * x21y10 + 2 * x21y8 + 1 * x21y6 + 11 * x22y5 + 10 * x22y3 + 9 * x22y8 + 8 * x22y2 + 7 * x22y9 + 6 * x22y1 + 5 * x22y11 + 4 * x22y7 + 3 * x22y4 + 2 * x22y10 + 1 * x22y6 + 11 * x23y2 + 10 * x23y4 + 9 * x23y11 + 8 * x23y8 + 7 * x23y7 + 6 * x23y5 + 5 * x23y1 + 4 * x23y9 + 3 * x23y3 + 2 * x23y10 + 1 * x23y6 + 11 * x24y8 + 10 * x24y5 + 9 * x24y10 + 8 * x24y4 + 7 * x24y7 + 6 * x24y11 + 5 * x24y9 + 4 * x24y2 + 3 * x24y1 + 2 * x24y3 + 1 * x24y6 + 11 * x25y2 + 10 * x25y4 + 9 * x25y11 + 8 * x25y7 + 7 * x25y1 + 6 * x25y8 + 5 * x25y10 + 4 * x25y5 + 3 * x25y9 + 2 * x25y3 + 1 * x25y6 + 11 * x26y5 + 10 * x26y7 + 9 * x26y1 + 8 * x26y10 + 7 * x26y2 + 6 * x26y6 + 5 * x26y4 + 4 * x26y8 + 3 * x26y11 + 2 * x26y3 + 1 * x26y9 + 11 * x27y4 + 10 * x27y5 + 9 * x27y2 + 8 * x27y7 + 7 * x27y3 + 6 * x27y8 + 5 * x27y10 + 4 * x27y1 + 3 * x27y6 + 2 * x27y11 + 1 * x27y9 + 11 * x28y5 + 10 * x28y2 + 9 * x28y4 + 8 * x28y1 + 7 * x28y7 + 6 * x28y10 + 5 * x28y11 + 4 * x28y3 + 3 * x28y8 + 2 * x28y9 + 1 * x28y6 + 11 * x29y2 + 10 * x29y7 + 9 * x29y11 + 8 * x29y1 + 7 * x29y8 + 6 * x29y4 + 5 * x29y3 + 4 * x29y10 + 3 * x29y9 + 2 * x29y5 + 1 * x29y6 + 11 * x30y5 + 10 * x30y10 + 9 * x30y11 + 8 * x30y1 + 7 * x30y8 + 6 * x30y2 + 5 * x30y9 + 4 * x30y7 + 3 * x30y3 + 2 * x30y4 + 1 * x30y6 + 11 * x31y2 + 10 * x31y11 + 9 * x31y1 + 8 * x31y7 + 7 * x31y3 + 6 * x31y10 + 5 * x31y5 + 4 * x31y8 + 3 * x31y4 + 2 * x31y6 + 1 * x31y9 + 11 * x32y8 + 10 * x32y1 + 9 * x32y3 + 8 * x32y11 + 7 * x32y4 + 6 * x32y2 + 5 * x32y10 + 4 * x32y7 + 3 * x32y5 + 2 * x32y9 + 1 * x32y6 + 11 * x33y4 + 10 * x33y7 + 9 * x33y1 + 8 * x33y10 + 7 * x33y8 + 6 * x33y9 + 5 * x33y2 + 4 * x33y5 + 3 * x33y11 + 2 * x33y6 + 1 * x33y3 + 11 * x34y4 + 10 * x34y5 + 9 * x34y11 + 8 * x34y3 + 7 * x34y10 + 6 * x34y1 + 5 * x34y2 + 4 * x34y7 + 3 * x34y8 + 2 * x34y9 + 1 * x34y6 + 11 * x35y11 + 10 * x35y4 + 9 * x35y5 + 8 * x35y7 + 7 * x35y10 + 6 * x35y3 + 5 * x35y2 + 4 * x35y8 + 3 * x35y9 + 2 * x35y1 + 1 * x35y6 + 11 * x36y2 + 10 * x36y11 + 9 * x36y7 + 8 * x36y1 + 7 * x36y5 + 6 * x36y3 + 5 * x36y4 + 4 * x36y9 + 3 * x36y8 + 2 * x36y10 + 1 * x36y6 + 11 * x37y7 + 10 * x37y4 + 9 * x37y10 + 8 * x37y11 + 7 * x37y1 + 6 * x37y2 + 5 * x37y3 + 4 * x37y9 + 3 * x37y5 + 2 * x37y6 + 1 * x37y8 + 11 * x38y8 + 10 * x38y1 + 9 * x38y7 + 8 * x38y2 + 7 * x38y3 + 6 * x38y5 + 5 * x38y6 + 4 * x38y4 + 3 * x38y9 + 2 * x38y11 + 1 * x38y10 + 11 * x39y8 + 10 * x39y11 + 9 * x39y3 + 8 * x39y10 + 7 * x39y5 + 6 * x39y2 + 5 * x39y1 + 4 * x39y7 + 3 * x39y9 + 2 * x39y4 + 1 * x39y6 + 11 * x40y4 + 10 * x40y11 + 9 * x40y5 + 8 * x40y2 + 7 * x40y7 + 6 * x40y3 + 5 * x40y8 + 4 * x40y10 + 3 * x40y6 + 2 * x40y1 + 1 * x40y9 + 11 * x41y2 + 10 * x41y9 + 9 * x41y8 + 8 * x41y1 + 7 * x41y10 + 6 * x41y4 + 5 * x41y3 + 4 * x41y5 + 3 * x41y11 + 2 * x41y7 + 1 * x41y6 + 11 * x42y2 + 10 * x42y9 + 9 * x42y8 + 8 * x42y10 + 7 * x42y1 + 6 * x42y4 + 5 * x42y6 + 4 * x42y7 + 3 * x42y5 + 2 * x42y3 + 1 * x42y11 + 11 * x43y11 + 10 * x43y4 + 9 * x43y5 + 8 * x43y7 + 7 * x43y10 + 6 * x43y3 + 5 * x43y2 + 4 * x43y8 + 3 * x43y9 + 2 * x43y1 + 1 * x43y6 + 11 * x44y4 + 10 * x44y1 + 9 * x44y3 + 8 * x44y11 + 7 * x44y8 + 6 * x44y2 + 5 * x44y7 + 4 * x44y10 + 3 * x44y5 + 2 * x44y9 + 1 * x44y6 + 11 * x45y8 + 10 * x45y2 + 9 * x45y11 + 8 * x45y10 + 7 * x45y4 + 6 * x45y9 + 5 * x45y3 + 4 * x45y7 + 3 * x45y5 + 2 * x45y1 + 1 * x45y6 + 11 * x46y8 + 10 * x46y3 + 9 * x46y4 + 8 * x46y2 + 7 * x46y9 + 6 * x46y10 + 5 * x46y1 + 4 * x46y11 + 3 * x46y7 + 2 * x46y6 + 1 * x46y5 + 11 * x47y11 + 10 * x47y2 + 9 * x47y4 + 8 * x47y1 + 7 * x47y8 + 6 * x47y5 + 5 * x47y10 + 4 * x47y7 + 3 * x47y9 + 2 * x47y3 + 1 * x47y6 + 11 * x48y2 + 10 * x48y4 + 9 * x48y10 + 8 * x48y11 + 7 * x48y1 + 6 * x48y5 + 5 * x48y7 + 4 * x48y8 + 3 * x48y9 + 2 * x48y3 + 1 * x48y6 + 11 * x49y7 + 10 * x49y10 + 9 * x49y4 + 8 * x49y3 + 7 * x49y5 + 6 * x49y6 + 5 * x49y2 + 4 * x49y11 + 3 * x49y8 + 2 * x49y9 + 1 * x49y1 + 11 * x50y11 + 10 * x50y10 + 9 * x50y5 + 8 * x50y2 + 7 * x50y4 + 6 * x50y1 + 5 * x50y7 + 4 * x50y8 + 3 * x50y3 + 2 * x50y6 + 1 * x50y9 + 11 * x51y4 + 10 * x51y11 + 9 * x51y1 + 8 * x51y3 + 7 * x51y7 + 6 * x51y2 + 5 * x51y10 + 4 * x51y5 + 3 * x51y8 + 2 * x51y9 + 1 * x51y6 + 11 * x52y8 + 10 * x52y1 + 9 * x52y6 + 8 * x52y4 + 7 * x52y2 + 6 * x52y11 + 5 * x52y7 + 4 * x52y9 + 3 * x52y5 + 2 * x52y3 + 1 * x52y10 + 11 * x53y2 + 10 * x53y4 + 9 * x53y7 + 8 * x53y11 + 7 * x53y5 + 6 * x53y10 + 5 * x53y1 + 4 * x53y3 + 3 * x53y9 + 2 * x53y8 + 1 * x53y6 + 11 * x54y2 + 10 * x54y1 + 9 * x54y7 + 8 * x54y10 + 7 * x54y11 + 6 * x54y4 + 5 * x54y5 + 4 * x54y9 + 3 * x54y6 + 2 * x54y8 + 1 * x54y3 + 11 * x55y7 + 10 * x55y1 + 9 * x55y4 + 8 * x55y3 + 7 * x55y2 + 6 * x55y11 + 5 * x55y8 + 4 * x55y10 + 3 * x55y9 + 2 * x55y5 + 1 * x55y6 + 11 * x56y4 + 10 * x56y5 + 9 * x56y2 + 8 * x56y3 + 7 * x56y7 + 6 * x56y11 + 5 * x56y1 + 4 * x56y8 + 3 * x56y10 + 2 * x56y9 + 1 * x56y6 + 11 * x57y5 + 10 * x57y4 + 9 * x57y11 + 8 * x57y2 + 7 * x57y1 + 6 * x57y3 + 5 * x57y7 + 4 * x57y10 + 3 * x57y9 + 2 * x57y8 + 1 * x57y6 + 11 * x58y3 + 10 * x58y2 + 9 * x58y1 + 8 * x58y7 + 7 * x58y4 + 6 * x58y8 + 5 * x58y6 + 4 * x58y9 + 3 * x58y5 + 2 * x58y10 + 1 * x58y11 + 11 * x59y8 + 10 * x59y4 + 9 * x59y5 + 8 * x59y11 + 7 * x59y3 + 6 * x59y10 + 5 * x59y7 + 4 * x59y1 + 3 * x59y2 + 2 * x59y9 + 1 * x59y6 + 11 * x60y4 + 10 * x60y11 + 9 * x60y2 + 8 * x60y3 + 7 * x60y5 + 6 * x60y8 + 5 * x60y10 + 4 * x60y7 + 3 * x60y1 + 2 * x60y9 + 1 * x60y6 + 11 * x61y10 + 10 * x61y2 + 9 * x61y8 + 8 * x61y1 + 7 * x61y7 + 6 * x61y3 + 5 * x61y5 + 4 * x61y11 + 3 * x61y4 + 2 * x61y9 + 1 * x61y6 + 11 * x62y6 + 10 * x62y8 + 9 * x62y10 + 8 * x62y3 + 7 * x62y11 + 6 * x62y9 + 5 * x62y2 + 4 * x62y4 + 3 * x62y5 + 2 * x62y1 + 1 * x62y7 + 11 * x63y4 + 10 * x63y3 + 9 * x63y7 + 8 * x63y2 + 7 * x63y5 + 6 * x63y11 + 5 * x63y1 + 4 * x63y8 + 3 * x63y9 + 2 * x63y10 + 1 * x63y6 + 11 * x64y8 + 10 * x64y2 + 9 * x64y10 + 8 * x64y3 + 7 * x64y1 + 6 * x64y7 + 5 * x64y9 + 4 * x64y4 + 3 * x64y11 + 2 * x64y6 + 1 * x64y5 + 11 * x65y4 + 10 * x65y3 + 9 * x65y7 + 8 * x65y2 + 7 * x65y5 + 6 * x65y11 + 5 * x65y1 + 4 * x65y8 + 3 * x65y9 + 2 * x65y10 + 1 * x65y6 + 11 * x66y11 + 10 * x66y2 + 9 * x66y3 + 8 * x66y4 + 7 * x66y8 + 6 * x66y7 + 5 * x66y10 + 4 * x66y1 + 3 * x66y9 + 2 * x66y5 + 1 * x66y6 + 11 * x67y4 + 10 * x67y8 + 9 * x67y11 + 8 * x67y10 + 7 * x67y2 + 6 * x67y3 + 5 * x67y5 + 4 * x67y9 + 3 * x67y7 + 2 * x67y1 + 1 * x67y6 + 11 * x68y8 + 10 * x68y1 + 9 * x68y6 + 8 * x68y7 + 7 * x68y11 + 6 * x68y4 + 5 * x68y3 + 4 * x68y9 + 3 * x68y5 + 2 * x68y2 + 1 * x68y10 + 11 * x69y11 + 10 * x69y10 + 9 * x69y2 + 8 * x69y5 + 7 * x69y4';


    // objective = '11 * x1y1 + 10 * x1y2 + 9 * x1y3 + 8 * x1y4 + 7 * x1y5 + 6 * x1y6 + 5 * x1y7 + 4 * x1y8 + 3 * x1y9 + 2 * x1y10 + 1 * x1y11 + 11 * x2y4 + 10 * x2y5 + 9 * x2y7 + 8 * x2y2 + 7 * x2y1 + 6 * x2y10 + 5 * x2y6 + 4 * x2y8 + 3 * x2y3 + 2 * x2y11 + 1 * x2y9 + 11 * x3y5 + 10 * x3y2 + 9 * x3y7 + 8 * x3y1 + 7 * x3y11 + 6 * x3y4 + 5 * x3y9 + 4 * x3y10 + 3 * x3y8 + 2 * x3y6 + 1 * x3y3 + 11 * x4y8 + 10 * x4y4 + 9 * x4y11 + 8 * x4y5 + 7 * x4y10 + 6 * x4y7 + 5 * x4y1 + 4 * x4y2 + 3 * x4y3 + 2 * x4y9 + 1 * x4y6 + 11 * x5y3 + 10 * x5y2 + 9 * x5y8 + 8 * x5y1 + 7 * x5y7 + 6 * x5y6 + 5 * x5y4 + 4 * x5y9 + 3 * x5y10 + 2 * x5y5 + 1 * x5y11 + 11 * x6y10 + 10 * x6y2 + 9 * x6y4 + 8 * x6y7 + 7 * x6y1 + 6 * x6y6 + 5 * x6y8 + 4 * x6y9 + 3 * x6y3 + 2 * x6y11 + 1 * x6y5 + 11 * x7y2 + 10 * x7y4 + 9 * x7y3 + 8 * x7y6 + 7 * x7y7 + 6 * x7y1 + 5 * x7y10 + 4 * x7y8 + 3 * x7y9 + 2 * x7y5 + 1 * x7y11 + 11 * x8y10 + 10 * x8y11 + 9 * x8y1 + 8 * x8y2 + 7 * x8y4 + 6 * x8y8 + 5 * x8y7 + 4 * x8y5 + 3 * x8y9 + 2 * x8y3 + 1 * x8y6 + 11 * x9y3 + 10 * x9y7 + 9 * x9y4 + 8 * x9y1 + 7 * x9y5 + 6 * x9y6 + 5 * x9y10 + 4 * x9y2 + 3 * x9y9 + 2 * x9y8 + 1 * x9y11 + 11 * x10y2 + 10 * x10y1 + 9 * x10y4 + 8 * x10y7 + 7 * x10y11 + 6 * x10y5 + 5 * x10y3 + 4 * x10y9 + 3 * x10y10 + 2 * x10y6 + 1 * x10y8 + 11 * x11y3 + 10 * x11y1 + 9 * x11y9 + 8 * x11y4 + 7 * x11y2 + 6 * x11y7 + 5 * x11y10 + 4 * x11y5 + 3 * x11y11 + 2 * x11y6 + 1 * x11y8 + 11 * x12y2 + 10 * x12y3 + 9 * x12y8 + 8 * x12y10 + 7 * x12y11 + 6 * x12y6 + 5 * x12y1 + 4 * x12y5 + 3 * x12y7 + 2 * x12y4 + 1 * x12y9 + 11 * x13y5 + 10 * x13y7 + 9 * x13y1 + 8 * x13y10 + 7 * x13y2 + 6 * x13y6 + 5 * x13y4 + 4 * x13y8 + 3 * x13y11 + 2 * x13y3 + 1 * x13y9 + 11 * x14y8 + 10 * x14y1 + 9 * x14y11 + 8 * x14y3 + 7 * x14y7 + 6 * x14y4 + 5 * x14y2 + 4 * x14y9 + 3 * x14y10 + 2 * x14y5 + 1 * x14y6 + 11 * x15y4 + 10 * x15y2 + 9 * x15y7 + 8 * x15y11 + 7 * x15y5 + 6 * x15y10 + 5 * x15y9 + 4 * x15y8 + 3 * x15y3 + 2 * x15y1 + 1 * x15y6 + 11 * x16y4 + 10 * x16y11 + 9 * x16y1 + 8 * x16y7 + 7 * x16y10 + 6 * x16y9 + 5 * x16y5 + 4 * x16y8 + 3 * x16y3 + 2 * x16y2 + 1 * x16y6 + 11 * x17y7 + 10 * x17y1 + 9 * x17y2 + 8 * x17y3 + 7 * x17y11 + 6 * x17y5 + 5 * x17y8 + 4 * x17y10 + 3 * x17y4 + 2 * x17y9 + 1 * x17y6 + 11 * x18y2 + 10 * x18y4 + 9 * x18y11 + 8 * x18y8 + 7 * x18y3 + 6 * x18y10 + 5 * x18y7 + 4 * x18y1 + 3 * x18y5 + 2 * x18y9 + 1 * x18y6 + 11 * x19y5 + 10 * x19y11 + 9 * x19y4 + 8 * x19y3 + 7 * x19y10 + 6 * x19y7 + 5 * x19y8 + 4 * x19y9 + 3 * x19y1 + 2 * x19y6 + 1 * x19y2 + 11 * x20y10 + 10 * x20y11 + 9 * x20y2 + 8 * x20y9 + 7 * x20y1 + 6 * x20y4 + 5 * x20y5 + 4 * x20y8 + 3 * x20y7 + 2 * x20y6 + 1 * x20y3 + 11 * x21y4 + 10 * x21y2 + 9 * x21y11 + 8 * x21y5 + 7 * x21y1 + 6 * x21y7 + 5 * x21y3 + 4 * x21y9 + 3 * x21y10 + 2 * x21y8 + 1 * x21y6 + 11 * x22y5 + 10 * x22y3 + 9 * x22y8 + 8 * x22y2 + 7 * x22y9 + 6 * x22y1 + 5 * x22y11 + 4 * x22y7 + 3 * x22y4 + 2 * x22y10 + 1 * x22y6 + 11 * x23y2 + 10 * x23y4 + 9 * x23y11 + 8 * x23y8 + 7 * x23y7 + 6 * x23y5 + 5 * x23y1 + 4 * x23y9 + 3 * x23y3 + 2 * x23y10 + 1 * x23y6 + 11 * x24y8 + 10 * x24y5 + 9 * x24y10 + 8 * x24y4 + 7 * x24y7 + 6 * x24y11 + 5 * x24y9 + 4 * x24y2 + 3 * x24y1 + 2 * x24y3 + 1 * x24y6 + 11 * x25y2 + 10 * x25y4 + 9 * x25y11 + 8 * x25y7 + 7 * x25y1 + 6 * x25y8 + 5 * x25y10 + 4 * x25y5 + 3 * x25y9 + 2 * x25y3 + 1 * x25y6 + 11 * x26y5 + 10 * x26y7 + 9 * x26y1 + 8 * x26y10 + 7 * x26y2 + 6 * x26y6 + 5 * x26y4 + 4 * x26y8 + 3 * x26y11 + 2 * x26y3 + 1 * x26y9 + 11 * x27y4 + 10 * x27y5 + 9 * x27y2 + 8 * x27y7 + 7 * x27y3 + 6 * x27y8 + 5 * x27y10 + 4 * x27y1 + 3 * x27y6 + 2 * x27y11 + 1 * x27y9 + 11 * x28y5 + 10 * x28y2 + 9 * x28y4 + 8 * x28y1 + 7 * x28y7 + 6 * x28y10 + 5 * x28y11 + 4 * x28y3 + 3 * x28y8 + 2 * x28y9 + 1 * x28y6 + 11 * x29y2 + 10 * x29y7 + 9 * x29y11 + 8 * x29y1 + 7 * x29y8 + 6 * x29y4 + 5 * x29y3 + 4 * x29y10 + 3 * x29y9 + 2 * x29y5 + 1 * x29y6 + 11 * x30y5 + 10 * x30y10 + 9 * x30y11 + 8 * x30y1 + 7 * x30y8 + 6 * x30y2 + 5 * x30y9 + 4 * x30y7 + 3 * x30y3 + 2 * x30y4 + 1 * x30y6 + 11 * x31y2 + 10 * x31y11 + 9 * x31y1 + 8 * x31y7 + 7 * x31y3 + 6 * x31y10 + 5 * x31y5 + 4 * x31y8 + 3 * x31y4 + 2 * x31y6 + 1 * x31y9 + 11 * x32y8 + 10 * x32y1 + 9 * x32y3 + 8 * x32y11 + 7 * x32y4 + 6 * x32y2 + 5 * x32y10 + 4 * x32y7 + 3 * x32y5 + 2 * x32y9 + 1 * x32y6 + 11 * x33y4 + 10 * x33y7 + 9 * x33y1 + 8 * x33y10 + 7 * x33y8 + 6 * x33y9 + 5 * x33y2 + 4 * x33y5 + 3 * x33y11 + 2 * x33y6 + 1 * x33y3 + 11 * x34y4 + 10 * x34y5 + 9 * x34y11 + 8 * x34y3 + 7 * x34y10 + 6 * x34y1 + 5 * x34y2 + 4 * x34y7 + 3 * x34y8 + 2 * x34y9 + 1 * x34y6 + 11 * x35y11 + 10 * x35y4 + 9 * x35y5 + 8 * x35y7 + 7 * x35y10 + 6 * x35y3 + 5 * x35y2 + 4 * x35y8 + 3 * x35y9 + 2 * x35y1 + 1 * x35y6 + 11 * x36y2 + 10 * x36y11 + 9 * x36y7 + 8 * x36y1 + 7 * x36y5 + 6 * x36y3 + 5 * x36y4 + 4 * x36y9 + 3 * x36y8 + 2 * x36y10 + 1 * x36y6 + 11 * x37y7 + 10 * x37y4 + 9 * x37y10 + 8 * x37y11 + 7 * x37y1 + 6 * x37y2 + 5 * x37y3 + 4 * x37y9 + 3 * x37y5 + 2 * x37y6 + 1 * x37y8 + 11 * x38y8 + 10 * x38y1 + 9 * x38y7 + 8 * x38y2 + 7 * x38y3 + 6 * x38y5 + 5 * x38y6 + 4 * x38y4 + 3 * x38y9 + 2 * x38y11 + 1 * x38y10 + 11 * x39y8 + 10 * x39y11 + 9 * x39y3 + 8 * x39y10 + 7 * x39y5 + 6 * x39y2 + 5 * x39y1 + 4 * x39y7 + 3 * x39y9 + 2 * x39y4 + 1 * x39y6 + 11 * x40y4 + 10 * x40y11 + 9 * x40y5 + 8 * x40y2 + 7 * x40y7 + 6 * x40y3 + 5 * x40y8 + 4 * x40y10 + 3 * x40y6 + 2 * x40y1 + 1 * x40y9 + 11 * x41y2 + 10 * x41y9 + 9 * x41y8 + 8 * x41y1 + 7 * x41y10 + 6 * x41y4 + 5 * x41y3 + 4 * x41y5 + 3 * x41y11 + 2 * x41y7 + 1 * x41y6 + 11 * x42y2 + 10 * x42y9 + 9 * x42y8 + 8 * x42y10 + 7 * x42y1 + 6 * x42y4 + 5 * x42y6 + 4 * x42y7 + 3 * x42y5 + 2 * x42y3 + 1 * x42y11 + 11 * x43y11 + 10 * x43y4 + 9 * x43y5 + 8 * x43y7 + 7 * x43y10 + 6 * x43y3 + 5 * x43y2 + 4 * x43y8 + 3 * x43y9 + 2 * x43y1 + 1 * x43y6 + 11 * x44y4 + 10 * x44y1 + 9 * x44y3 + 8 * x44y11 + 7 * x44y8 + 6 * x44y2 + 5 * x44y7 + 4 * x44y10 + 3 * x44y5 + 2 * x44y9 + 1 * x44y6 + 11 * x45y8 + 10 * x45y2 + 9 * x45y11 + 8 * x45y10 + 7 * x45y4 + 6 * x45y9 + 5 * x45y3 + 4 * x45y7 + 3 * x45y5 + 2 * x45y1 + 1 * x45y6 + 11 * x46y8 + 10 * x46y3 + 9 * x46y4 + 8 * x46y2 + 7 * x46y9 + 6 * x46y10 + 5 * x46y1 + 4 * x46y11 + 3 * x46y7 + 2 * x46y6 + 1 * x46y5 + 11 * x47y11 + 10 * x47y2 + 9 * x47y4 + 8 * x47y1 + 7 * x47y8 + 6 * x47y5 + 5 * x47y10 + 4 * x47y7 + 3 * x47y9 + 2 * x47y3 + 1 * x47y6 + 11 * x48y2 + 10 * x48y4 + 9 * x48y10 + 8 * x48y11 + 7 * x48y1 + 6 * x48y5 + 5 * x48y7 + 4 * x48y8 + 3 * x48y9 + 2 * x48y3 + 1 * x48y6 + 11 * x49y7 + 10 * x49y10 + 9 * x49y4 + 8 * x49y3 + 7 * x49y5 + 6 * x49y6 + 5 * x49y2 + 4 * x49y11 + 3 * x49y8 + 2 * x49y9 + 1 * x49y1 + 11 * x50y11 + 10 * x50y10 + 9 * x50y5 + 8 * x50y2 + 7 * x50y4 + 6 * x50y1 + 5 * x50y7 + 4 * x50y8 + 3 * x50y3 + 2 * x50y6 + 1 * x50y9 + 11 * x51y4 + 10 * x51y11 + 9 * x51y1 + 8 * x51y3 + 7 * x51y7 + 6 * x51y2 + 5 * x51y10 + 4 * x51y5 + 3 * x51y8 + 2 * x51y9 + 1 * x51y6 + 11 * x52y8 + 10 * x52y1 + 9 * x52y6 + 8 * x52y4 + 7 * x52y2 + 6 * x52y11 + 5 * x52y7 + 4 * x52y9 + 3 * x52y5 + 2 * x52y3 + 1 * x52y10 + 11 * x53y2 + 10 * x53y4 + 9 * x53y7 + 8 * x53y11 + 7 * x53y5 + 6 * x53y10 + 5 * x53y1 + 4 * x53y3 + 3 * x53y9 + 2 * x53y8 + 1 * x53y6 + 11 * x54y2 + 10 * x54y1 + 9 * x54y7 + 8 * x54y10 + 7 * x54y11 + 6 * x54y4 + 5 * x54y5 + 4 * x54y9 + 3 * x54y6 + 2 * x54y8 + 1 * x54y3 + 11 * x55y7 + 10 * x55y1 + 9 * x55y4 + 8 * x55y3 + 7 * x55y2 + 6 * x55y11 + 5 * x55y8 + 4 * x55y10 + 3 * x55y9 + 2 * x55y5 + 1 * x55y6 + 11 * x56y4 + 10 * x56y5 + 9 * x56y2 + 8 * x56y3 + 7 * x56y7 + 6 * x56y11 + 5 * x56y1 + 4 * x56y8 + 3 * x56y10 + 2 * x56y9 + 1 * x56y6 + 11 * x57y5 + 10 * x57y4 + 9 * x57y11 + 8 * x57y2 + 7 * x57y1 + 6 * x57y3 + 5 * x57y7 + 4 * x57y10 + 3 * x57y9 + 2 * x57y8 + 1 * x57y6 + 11 * x58y3 + 10 * x58y2 + 9 * x58y1 + 8 * x58y7 + 7 * x58y4 + 6 * x58y8 + 5 * x58y6 + 4 * x58y9 + 3 * x58y5 + 2 * x58y10 + 1 * x58y11 + 11 * x59y8 + 10 * x59y4 + 9 * x59y5 + 8 * x59y11 + 7 * x59y3 + 6 * x59y10 + 5 * x59y7 + 4 * x59y1 + 3 * x59y2 + 2 * x59y9 + 1 * x59y6 + 11 * x60y4 + 10 * x60y11 + 9 * x60y2 + 8 * x60y3 + 7 * x60y5 + 6 * x60y8 + 5 * x60y10 + 4 * x60y7 + 3 * x60y1 + 2 * x60y9 + 1 * x60y6 + 11 * x61y10 + 10 * x61y2 + 9 * x61y8 + 8 * x61y1 + 7 * x61y7 + 6 * x61y3 + 5 * x61y5 + 4 * x61y11 + 3 * x61y4 + 2 * x61y9 + 1 * x61y6 + 11 * x62y6 + 10 * x62y8 + 9 * x62y10 + 8 * x62y3 + 7 * x62y11 + 6 * x62y9 + 5 * x62y2 + 4 * x62y4 + 3 * x62y5 + 2 * x62y1 + 1 * x62y7 + 11 * x63y4 + 10 * x63y3 + 9 * x63y7 + 8 * x63y2 + 7 * x63y5 + 6 * x63y11 + 5 * x63y1 + 4 * x63y8 + 3 * x63y9 + 2 * x63y10 + 1 * x63y6 + 11 * x64y8 + 10 * x64y2 + 9 * x64y10 + 8 * x64y3 + 7 * x64y1 + 6 * x64y7 + 5 * x64y9 + 4 * x64y4 + 3 * x64y11 + 2 * x64y6 + 1 * x64y5 + 11 * x65y4 + 10 * x65y3 + 9 * x65y7 + 8 * x65y2 + 7 * x65y5 + 6 * x65y11 + 5 * x65y1 + 4 * x65y8 + 3 * x65y9 + 2 * x65y10 + 1 * x65y6 + 11 * x66y11 + 10 * x66y2 + 9 * x66y3 + 8 * x66y4 + 7 * x66y8 + 6 * x66y7 + 5 * x66y10 + 4 * x66y1 + 3 * x66y9 + 2 * x66y5 + 1 * x66y6 + 11 * x67y4 + 10 * x67y8 + 9 * x67y11 + 8 * x67y10 + 7 * x67y2 + 6 * x67y3 + 5 * x67y5 + 4 * x67y9 + 3 * x67y7 + 2 * x67y1 + 1 * x67y6 + 11 * x68y8 + 10 * x68y1 + 9 * x68y6 + 8 * x68y7 + 7 * x68y11 + 6 * x68y4 + 5 * x68y3 + 4 * x68y9';

    // objective = 'x1y1';

    console.log('OBJECTIVE:', objective);

    return new Promise(function (resolve, reject) {

      // simplex.maximize(objective);
      // simplex.resolve();
      // simplex.log();

      // let score = simplex.getObjectiveValue();
      // console.log('Objective value:', score);

      // Assign the teams according to results
      // for (let i = 1; i <= persons.length; i++) {
      //   let person = persons[i - 1];
      //   for (let j = 1; j <= realTeams.length; j++) {
      //     let varName = 'x' + i + 'y' + j;
      //     if (simplex.getValue(varName) == 1) {
      //       realTeams[j - 1].add(person);
      //       break;
      //     }
      //   }
      // }

      // let result = maximize(objective, constraints);
      // console.log(result);

      // resolve(realTeams); // TODO: uncomment for navigation
    });

  }
}
