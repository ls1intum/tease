import { PersonConstraint } from './person-constraint';
import { Gender, Student } from '../student';
import { SkillLevel } from '../skill';
import { Device } from '../device';

export class DevicePossessionPersonConstraint extends PersonConstraint {
  device: Device = Device.Mac;

  static getTyped(constraint: PersonConstraint): DevicePossessionPersonConstraint {
    if (constraint instanceof DevicePossessionPersonConstraint) return constraint;

    return null;
  }

  isFullfilledFor(person: Student): boolean {
    return person.devices.find(d => d === this.device) !== undefined;
  }

  copy(): PersonConstraint {
    const newConstraint = new DevicePossessionPersonConstraint();
    newConstraint.device = this.device;
    return newConstraint;
  }
}
