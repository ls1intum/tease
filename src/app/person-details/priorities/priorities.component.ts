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
  @Input()
  private markedPriorities: Team[];

  constructor(){

  }

  getPriorityNumber(teamPriority: Team): number{
    return this.teamPriorities.indexOf(teamPriority)+1;
  }

  getPriorityName(teamPriority: Team): string {
    return teamPriority.name;
  }

  isMarked(teamPriority: Team): boolean {
    if(this.markedPriorities === undefined)return false;
    return this.markedPriorities.includes(teamPriority);
  }
}
