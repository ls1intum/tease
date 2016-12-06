import {Component, Input} from "@angular/core";
import {Person} from "../../shared/models/person";
import {Team} from "../../shared/models/team";
/**
 * Created by Malte Bucksch on 06/12/2016.
 */

@Component({
  templateUrl: './team-container.component.html',
  selector: 'team-container',
  styleUrls: ['./team-container.component.css']
})
export class TeamContainerComponent {
  @Input()
  private team: Team;


}
