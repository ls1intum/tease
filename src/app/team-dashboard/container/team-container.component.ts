import {Component, Input, ViewContainerRef, Output, EventEmitter} from "@angular/core";
import {Team} from "../../shared/models/team";
import {DialogService} from "../../shared/ui/dialog.service";
import {Person} from "../../shared/models/person";
import {DeviceType, Device} from "../../shared/models/device";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {TeamHelper} from "../../shared/helpers/team.helper";
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
  @Input()
  private teams: Team[];

  private isStatisticsVisible = false;
  public LocalDeviceType = DeviceType;
  @Output() personClose = new EventEmitter();

  constructor(private dialogService: DialogService,
              private viewContainerRef: ViewContainerRef,
              private iconMapperService: IconMapperService){

  }

  showPersonDetails(person: Person){
    let persons = TeamHelper.getPersons(this.teams);
    this.dialogService.showPersonDetails(person,persons, this.viewContainerRef).subscribe(result => {
      this.personClose.emit();
    });
  }

  getDevices(): Device[]{
    return [].concat(...this.team.persons.map(person => person.devices));
  }

  private getPersonDeviceCount(person: Person, targetDevice: DeviceType): number {
    return person.devices.filter(device => device.deviceType === targetDevice).length;
  }

  showStatistics(){
    this.isStatisticsVisible = !this.isStatisticsVisible;
  }
}
