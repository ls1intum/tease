import {Component, Input, ViewContainerRef} from "@angular/core";
import {Team} from "../../shared/models/team";
import {DialogService} from "../../shared/ui/dialog.service";
import {Person} from "../../shared/models/person";
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

  constructor(private dialogService: DialogService,
              private viewContainerRef: ViewContainerRef){

  }

  showPersonDetails(person: Person){
    this.dialogService.showPersonDetails(person,this.viewContainerRef);
  }

  showStatistics(){
    this.isStatisticsVisible = !this.isStatisticsVisible;
  }
}
