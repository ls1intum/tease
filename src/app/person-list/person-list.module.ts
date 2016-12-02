import {PersonListComponent} from "./person-list.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {MaterialModule} from "@angular/material";
import {PersonDetailComponent} from "../person-details/person-detail.component";
import {PersonPreviewComponent} from "./person-preview.component";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";

/**
 * Created by wanur on 05/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot()],
  declarations: [PersonListComponent, PersonPreviewComponent],
  exports: [PersonListComponent, PersonPreviewComponent],
  providers: [TeamService],
  entryComponents: [PersonDetailComponent]
})
export class PersonListModule {

}
