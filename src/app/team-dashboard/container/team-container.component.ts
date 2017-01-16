import {Component, Input, ViewContainerRef, Output, EventEmitter, AfterViewInit} from "@angular/core";
import {Team} from "../../shared/models/team";
import {DialogService, EventTypePersonDetails} from "../../shared/ui/dialog.service";
import {Person} from "../../shared/models/person";
import {DeviceType, Device} from "../../shared/models/device";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {TeamHelper} from "../../shared/helpers/team.helper";
import {PersonService} from "../../shared/layers/business-logic-layer/person.service";

/**
 * Created by Malte Bucksch on 06/12/2016.
 */

@Component({
  templateUrl: './team-container.component.html',
  selector: 'team-container',
  styleUrls: ['./team-container.component.css',
    '../styles/dragula.min.css'],
})
export class TeamContainerComponent implements AfterViewInit {
  @Input()
  private team: Team;
  @Input()
  private teams: Team[];

  private persons: Person[];
  private isStatisticsVisible = false;
  public LocalDeviceType = DeviceType;
  @Output() personClose = new EventEmitter();

  constructor(private dialogService: DialogService,
              private personService: PersonService,
              private viewContainerRef: ViewContainerRef,
              private iconMapperService: IconMapperService) {
  }

  ngAfterViewInit(): void {
    this.persons = TeamHelper.getPersons(this.teams);
  }

  showPersonDetails(person: Person) {
    this.dialogService.showPersonDetails(person, this.persons, this.viewContainerRef)
      .subscribe(event => {
        this.personClose.emit();

        if (event === EventTypePersonDetails.NextPersonPressed)
          this.showNextUnratedPerson();
      });
  }

  showNextUnratedPerson() {
    let nextPerson = this.personService.getNextUnratedPerson(this.persons);
    if (nextPerson === undefined) {
      console.log("Already rated all persons");
      return;
    }

    this.showPersonDetails(nextPerson);
  }

  getDevices(): Device[] {
    return [].concat(...this.team.persons.map(person => person.devices));
  }

  private getPersonDeviceCount(person: Person, targetDevice: DeviceType): number {
    return person.devices.filter(device => device.deviceType === targetDevice).length;
  }

  showStatistics() {
    this.isStatisticsVisible = !this.isStatisticsVisible;
  }
}
