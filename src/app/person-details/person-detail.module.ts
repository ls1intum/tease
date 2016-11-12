
import {NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PersonDetailComponent} from "./person-detail.component";
import {PersonListService} from "../shared/person-list/person-list.service";
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "@angular/material";
@NgModule({
  imports: [CommonModule, SharedModule,  MaterialModule.forRoot()],
  declarations: [PersonDetailComponent],
  exports: [PersonDetailComponent],
  providers: [PersonListService]
})
export class PersonDetailModule { }
