import {Component, Input} from "@angular/core";
import {DeviceType, Device} from "../../shared/models/device";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
/**
 * Created by Malte Bucksch on 17/12/2016.
 */

@Component({
  selector: 'devices',
  templateUrl: './devices.component.html',
  styleUrls: ["./devices.component.css"]
})
export class DevicesComponent {
  @Input()
  private devices: Device[];
  @Input()
  private alignCenter: boolean = true;

  public LocalDeviceType = DeviceType;

  constructor(private iconMapperService: IconMapperService) {

  }

  getDeviceIconPath(deviceType: DeviceType): string {
    return this.iconMapperService.getDeviceTypeIconPath(deviceType);
  }

  getDeviceName(deviceType: DeviceType): string {
    return new Device(deviceType).toString();
  }

  private getDeviceCount(targetDevice: DeviceType): number {
    let deviceCount = this.devices.filter(device => device.deviceType === targetDevice).length;

    if (targetDevice === DeviceType.Iphone)
      deviceCount += this.getDeviceCount(DeviceType.Ipod);

    return deviceCount;
  }
}
