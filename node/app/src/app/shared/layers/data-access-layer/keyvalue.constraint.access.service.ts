import {Injectable} from "@angular/core";
import {Constraint} from "../../models/constraints/constraint";
import {ConstraintAccessService} from "./constraint.access.service";
import {FemalePersonConstraint} from "../../models/constraints/female-person.constraint";
import {TeamSizeConstraint} from "../../models/constraints/team-size.constraint";
import {IosDeviceConstraint} from "../../models/constraints/ios-device.constraint";
import {MacDeviceConstraint} from "../../models/constraints/mac-device.constraint";
import {TeamAccessService} from "./team.access.service";

/**
 * Created by Malte Bucksch on 23/02/2017.
 */
@Injectable()
export class KeyValueConstraintAccessService extends ConstraintAccessService {

  constructor(public teamAccessService: TeamAccessService) {
    super();
  }

  private static readonly KeyMacDeviceConstraint = "KeyMacDeviceConstraint";
  private static readonly KeyIosDeviceConstraint = "KeyIosDeviceConstraint";
  private static readonly KeyFemalePersonConstraint = "KeyFemalePersonConstraint";
  private static readonly KeyTeamSizeConstraint = "KeyTeamSizeConstraint";

  private static readonly ConstraintDefinitionArray = [
    {classDefinition: MacDeviceConstraint, storageKey: KeyValueConstraintAccessService.KeyMacDeviceConstraint},
    {classDefinition: IosDeviceConstraint, storageKey: KeyValueConstraintAccessService.KeyIosDeviceConstraint},
    {classDefinition: FemalePersonConstraint, storageKey: KeyValueConstraintAccessService.KeyFemalePersonConstraint},
    {classDefinition: TeamSizeConstraint, storageKey: KeyValueConstraintAccessService.KeyTeamSizeConstraint},
  ];

  private serializeConstraint(constraint: Constraint): string {
    return JSON.stringify(constraint);
  }

  private unserializeConstraint(constraint: string): any {
    return JSON.parse(constraint);
  }

  private getTeamBasedConstraintKeyPrefix(teamName: string): string {
    if (teamName) {
      return '[' + teamName + ']-';
    }
    return '';
  }

  saveConstraints(constraints: Constraint[]) {

    for (let constraint of constraints) {
      let constraintClassDefinition = KeyValueConstraintAccessService.ConstraintDefinitionArray
        .filter(constraintClassDefinition => {
          return constraint instanceof constraintClassDefinition.classDefinition;
        })[0];

      if (!constraintClassDefinition) {
        console.error('Unexpected constraint:', constraint);
      } else {

        let keyPrefix = this.getTeamBasedConstraintKeyPrefix(constraint.getTeamName()) || '';

        let storageKey = keyPrefix + constraintClassDefinition.storageKey;
        localStorage.setItem(storageKey, this.serializeConstraint(constraint));
      }

    }

  }

  fetchConstraints(): Promise<Constraint[]> {
    return new Promise((resolve, reject) => {
      let constraints: Constraint[] = [];

      // global constraints
      KeyValueConstraintAccessService.ConstraintDefinitionArray.forEach(constraintClassDefinition => {
        let classDefinition = constraintClassDefinition.classDefinition;
        let storageKey = constraintClassDefinition.storageKey;

        let storedConfig = this.unserializeConstraint(localStorage.getItem(storageKey)) || {};

        let constraint = new classDefinition(storedConfig);

        constraints.push(constraint);

      });

      // team-based constraints
      this.teamAccessService.readSavedTeams().then(teams => {

        teams.forEach(team => {

          let keyPrefix = this.getTeamBasedConstraintKeyPrefix(team.name);

          KeyValueConstraintAccessService.ConstraintDefinitionArray.forEach(constraintClassDefinition => {
            let classDefinition = constraintClassDefinition.classDefinition;
            let storageKey = keyPrefix + constraintClassDefinition.storageKey;

            let storedConfig = this.unserializeConstraint(localStorage.getItem(storageKey)) || {};

            // ensure this constraint belongs to the given team
            storedConfig.teamName = team.name;

            let constraint = new classDefinition(storedConfig);

            constraints.push(constraint);

          });

        });

      });

      resolve(constraints);

    });

  }
}
