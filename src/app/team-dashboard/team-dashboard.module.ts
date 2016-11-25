import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@angular/material";
import {TeamDashboardComponent} from "./team-dashboard.component";
import {PersonService} from "../shared/layers/business-logic-layer/person.service";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
import {PersonDetailComponent} from "../person-details/person-detail.component";
import {DragulaModule} from "ng2-dragula/ng2-dragula";
/**
 * Created by Malte Bucksch on 25/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot(), DragulaModule],
  declarations: [TeamDashboardComponent],
  exports: [TeamDashboardComponent],
  providers: [PersonService,TeamService],
  entryComponents: [PersonDetailComponent]
})
export class TeamDashboardModule {

}
