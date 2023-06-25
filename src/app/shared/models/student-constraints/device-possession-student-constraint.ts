import { StudentConstraint } from './student-constraint';
import { Gender, Student } from '../student';
import { SkillLevel } from '../skill';
import { Device } from '../device';

export class DevicePossessionStudentConstraint extends StudentConstraint {
  device: Device = Device.Mac;

  static getTyped(constraint: StudentConstraint): DevicePossessionStudentConstraint {
    if (constraint instanceof DevicePossessionStudentConstraint) return constraint;

    return null;
  }

  isFullfilledFor(person: Student): boolean {
    return person.devices.find(d => d === this.device) !== undefined;
  }

  copy(): StudentConstraint {
    const newConstraint = new DevicePossessionStudentConstraint();
    newConstraint.device = this.device;
    return newConstraint;
  }
}
