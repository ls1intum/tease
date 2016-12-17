import {Component, Input, ViewContainerRef, Output, EventEmitter} from "@angular/core";
import {Team} from "../../shared/models/team";
import {DialogService} from "../../shared/ui/dialog.service";
import {Person} from "../../shared/models/person";
import {DeviceType} from "../../shared/models/device";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
/**
 * Created by Malte Bucksch on 06/12/2016.
 */

@Component({
  templateUrl: './team-container.component.html',
  selector: 'team-container',
  styleUrls: ['./team-container.component.css',
    '../styles/dragula.min.css'],
})
export class TeamContainerComponent {
  @Input()
  private team: Team;
  private isStatisticsVisible = false;
  public LocalDeviceType = DeviceType;
  @Output() personClose = new EventEmitter();

  constructor(private dialogService: DialogService,
              private viewContainerRef: ViewContainerRef,
              private iconMapperService: IconMapperService){

  }

  showPersonDetails(person: Person){
    this.dialogService.showPersonDetails(person,this.viewContainerRef).subscribe(result => {
      this.personClose.emit();
    });
  }

  getDeviceCount(device: DeviceType): number{
    return this.team.persons
      .map(person => this.getPersonDeviceCount(person,device))
      .reduce((sum, count)=>sum+count, 0);
  }

  getDeviceIconPath(deviceType: DeviceType): string {
    return this.iconMapperService.getDeviceTypeIconPath(deviceType);
  }

  private getPersonDeviceCount(person: Person, targetDevice: DeviceType): number {
    return person.devices.filter(device => device.deviceType === targetDevice).length;
  }

  showStatistics(){
    this.isStatisticsVisible = !this.isStatisticsVisible;
  }
}
