
import {NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PersonDetailComponent} from "./person-detail.component";
import {PersonListService} from "../shared/person-list/person-list.service";
import {SharedModule} from "../shared/shared.module";
@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [PersonDetailComponent],
  exports: [PersonDetailComponent],
  providers: [PersonListService]
})
export class PersonDetailModule { }
