import {PersonListComponent} from "./person-list.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {MaterialModule} from "@angular/material";
import {PersonDetailComponent} from "../person-details/person-detail.component";

/**
 * Created by wanur on 05/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot()],
  declarations: [PersonListComponent],
  exports: [PersonListComponent],
  providers: [PersonService],
  entryComponents: [PersonDetailComponent]
})
export class PersonListModule {

}
