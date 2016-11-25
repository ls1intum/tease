import {PersonListComponent} from "./person-list.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PersonService} from "../shared/layers/business-logic-layer/person.service";
import {MaterialModule} from "@angular/material";

/**
 * Created by wanur on 05/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot()],
  declarations: [PersonListComponent],
  exports: [PersonListComponent],
  providers: [PersonService]
})
export class PersonListModule {

}