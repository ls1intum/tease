import {PersonListComponent} from "./person-list.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {PersonListService} from "../shared/person-list/person-list.service";

/**
 * Created by wanur on 05/11/2016.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PersonListComponent],
  exports: [PersonListComponent],
  providers: [PersonListService]
})
export class PersonListModule {

}
