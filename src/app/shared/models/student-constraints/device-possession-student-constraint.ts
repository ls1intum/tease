import { StudentConstraint } from './student-constraint';
import { Student } from '../student';
import { Device } from '../device';

export class DevicePossessionStudentConstraint extends StudentConstraint {
  device: Device = Device.Mac;

  static getTyped(constraint: StudentConstraint): DevicePossessionStudentConstraint {
    if (constraint instanceof DevicePossessionStudentConstraint) return constraint;

    return null;
  }

  isFullfilledFor(student: Student): boolean {
    return student.devices.find(d => d === this.device) !== undefined;
  }

  copy(): StudentConstraint {
    const newConstraint = new DevicePossessionStudentConstraint();
    newConstraint.device = this.device;
    return newConstraint;
  }
}