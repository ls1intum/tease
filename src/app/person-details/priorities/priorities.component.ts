import {Component, Input} from "@angular/core";
import {DeviceType, Device} from "../../shared/models/device";
import {IconMapperService} from "../../shared/ui/icon-mapper.service";
import {Team} from "../../shared/models/team";
/**
 * Created by Malte Bucksch on 17/12/2016.
 */

@Component({
  selector: 'priorities',
  templateUrl: 'priorities.component.html',
  styleUrls: ["priorities.component.css"]
})
export class PrioritiesComponent {
  @Input()
  private teamPriorities: Team[];

  constructor(){
    debugger;
  }

  getPriorityNumber(priority: Team): number{
    return this.teamPriorities.indexOf(priority)+1;
  }

  getPriorityName(priority: Team): string {
    return priority.name;
  }
}
