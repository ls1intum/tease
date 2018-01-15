import {Injectable} from '@angular/core';
import {Constraint} from '../../models/constraints/constraint';
import {ConstraintAccessService} from './constraint.access.service';
import {FemalePersonConstraint} from '../../models/constraints/female-person.constraint';
import {TeamSizeConstraint} from '../../models/constraints/team-size.constraint';
import {IosDeviceConstraint} from '../../models/constraints/ios-device.constraint';
import {MacDeviceConstraint} from '../../models/constraints/mac-device.constraint';
import {SkillExpertConstraint} from '../../models/constraints/skill-expert.constraint';
import {SkillAdvancedConstraint} from '../../models/constraints/skill-advanced.constraint';
import {SkillNormalConstraint} from '../../models/constraints/skill-normal.constraint';
import {SkillNoviceConstraint} from '../../models/constraints/skill-novice.constraint';
import {CSVPersonDataAccessService} from './csv-person-data-access.service';

/**
 * Created by Malte Bucksch on 23/02/2017.
 */
@Injectable()
export class KeyValueConstraintAccessService extends ConstraintAccessService {

  constructor() {
    super();
  }

  private static readonly KeyMacDeviceConstraint = 'KeyMacDeviceConstraint';
  private static readonly KeyIosDeviceConstraint = 'KeyIosDeviceConstraint';
  private static readonly KeyFemalePersonConstraint = 'KeyFemalePersonConstraint';
  private static readonly KeyTeamSizeConstraint = 'KeyTeamSizeConstraint';
  private static readonly KeySkillExpertConstraint = 'KeySkillExpertConstraint';
  private static readonly KeySkillAdvancedConstraint = 'KeySkillAdvancedConstraint';
  private static readonly KeySkillNormalConstraint = 'KeySkillNormalConstraint';
  private static readonly KeySkillNoviceConstraint = 'KeySkillNoviceConstraint';

  private static readonly ConstraintDefinitionArray = [
    {classDefinition: MacDeviceConstraint, storageKey: KeyValueConstraintAccessService.KeyMacDeviceConstraint},
    {classDefinition: IosDeviceConstraint, storageKey: KeyValueConstraintAccessService.KeyIosDeviceConstraint},
    {classDefinition: FemalePersonConstraint, storageKey: KeyValueConstraintAccessService.KeyFemalePersonConstraint},
    {classDefinition: TeamSizeConstraint, storageKey: KeyValueConstraintAccessService.KeyTeamSizeConstraint},
    {classDefinition: SkillExpertConstraint, storageKey: KeyValueConstraintAccessService.KeySkillExpertConstraint},
    {classDefinition: SkillAdvancedConstraint, storageKey: KeyValueConstraintAccessService.KeySkillAdvancedConstraint},
    {classDefinition: SkillNormalConstraint, storageKey: KeyValueConstraintAccessService.KeySkillNormalConstraint},
    {classDefinition: SkillNoviceConstraint, storageKey: KeyValueConstraintAccessService.KeySkillNoviceConstraint},
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

    for (const constraint of constraints) {
      const constraintClassDefinition = KeyValueConstraintAccessService.ConstraintDefinitionArray
        .filter(currentConstraintClassDefinition => {
          return constraint instanceof currentConstraintClassDefinition.classDefinition;
        })[0];

      if (!constraintClassDefinition) {
        console.error('Unexpected constraint:', constraint);
      } else {

        const teamName = constraint.getTeamName();
        const keyPrefix = this.getTeamBasedConstraintKeyPrefix(teamName);

        const storageKey = keyPrefix + constraintClassDefinition.storageKey;
        localStorage.setItem(storageKey, this.serializeConstraint(constraint));
      }

    }

  }

  fetchConstraints(): Promise<Constraint[]> {
    return new Promise((resolve, reject) => {
      const constraints: Constraint[] = [];

      // global constraints
      KeyValueConstraintAccessService.ConstraintDefinitionArray.forEach(constraintClassDefinition => {
        const classDefinition = constraintClassDefinition.classDefinition;
        const teamName = null;
        const keyPrefix = this.getTeamBasedConstraintKeyPrefix(teamName);
        const storageKey = keyPrefix + constraintClassDefinition.storageKey;

        const storedConfig = this.unserializeConstraint(localStorage.getItem(storageKey)) || {};

        // ensure this constraint is not confused with others
        storedConfig.teamName = teamName;

        const constraint = new classDefinition(storedConfig);

        constraints.push(constraint);

      });

      // team-based constraints
      CSVPersonDataAccessService.readDataFromBrowserStorage().then(data => {
        const [persons, teams] = data;

        teams.forEach(team => {
          const teamName = team.name;
          const keyPrefix = this.getTeamBasedConstraintKeyPrefix(teamName);

          KeyValueConstraintAccessService.ConstraintDefinitionArray.forEach(constraintClassDefinition => {
            const classDefinition = constraintClassDefinition.classDefinition;
            const storageKey = keyPrefix + constraintClassDefinition.storageKey;

            const storedConfig = this.unserializeConstraint(localStorage.getItem(storageKey)) || {};

            // ensure this constraint belongs to the given team
            storedConfig.teamName = teamName;

            const constraint = new classDefinition(storedConfig);

            constraints.push(constraint);
          });
        });
      });

      resolve(constraints);
    });

  }
}
