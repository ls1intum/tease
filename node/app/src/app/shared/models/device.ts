/**
 * Created by Malte Bucksch on 09/12/2016.
 */

export class Device {
  deviceType: DeviceType;

  constructor(deviceType: DeviceType){
    this.deviceType = deviceType;
  }

  toString(): string {
    switch (this.deviceType){
      case DeviceType.Iphone:
        return 'iPhone';
      case DeviceType.Ipad:
        return 'iPad';
      case DeviceType.Ipod:
        return 'iPod';
      case DeviceType.Watch:
        return 'Watch';
      case DeviceType.Mac:
        return 'Mac';
    }
  }
}

export enum DeviceType {
  Iphone, Ipad, Ipod, Mac, Watch
}
