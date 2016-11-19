import {PersonListComponent} from "./person-list.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PersonListService} from "../shared/layers/business-logic-layer/person-list.service";
import {MaterialModule} from "@angular/material";

/**
 * Created by wanur on 05/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot()],
  declarations: [PersonListComponent],
  exports: [PersonListComponent],
  providers: [PersonListService]
})
export class PersonListModule {

}
