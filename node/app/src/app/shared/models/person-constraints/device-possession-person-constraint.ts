import {PersonConstraint} from './person-constraint';
import {Gender, Person} from '../person';
import {SkillLevel} from '../skill';
import {Device} from "../device";

export class DevicePossessionPersonConstraint extends PersonConstraint {
  device: Device = Device.Mac;

  isFullfilledFor(person: Person): boolean {
    return person.devices.find(d => d === this.device) !== null;
  }
}
