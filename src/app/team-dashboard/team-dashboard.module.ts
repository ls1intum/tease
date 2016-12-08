import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@angular/material";
import {TeamDashboardComponent} from "./dashboard/team-dashboard.component";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";
import {PersonDetailComponent} from "../person-details/person-detail.component";
import {DragulaModule} from "ng2-dragula/ng2-dragula";
import {PersonListModule} from "../person-list/list/person-list.module";
import {DragulaService} from "ng2-dragula/components/dragula.provider";
import {TeamContainerComponent} from "./container/team-container.component";
import {DialogService} from "../shared/ui/dialog.service";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot(), DragulaModule, PersonListModule],
  declarations: [TeamDashboardComponent, TeamContainerComponent],
  exports: [TeamDashboardComponent],
  providers: [PersonService,TeamService, DragulaService, DialogService],
  entryComponents: [PersonDetailComponent]
})
export class TeamDashboardModule {

}
