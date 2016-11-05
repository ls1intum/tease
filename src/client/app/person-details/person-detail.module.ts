
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PersonDetailComponent} from "./person-detail.component";
@NgModule({
  imports: [CommonModule],
  declarations: [PersonDetailComponent],
  exports: [PersonDetailComponent],
})
export class PersonDetailModule {

}
