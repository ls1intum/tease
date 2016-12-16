import {PersonListComponent} from "./list/person-list.component";
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "@angular/material";
import {PersonDetailComponent} from "../person-details/person-detail.component";
import {PersonPreviewComponent} from "./preview/person-preview.component";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
import {DialogService} from "../shared/ui/dialog.service";
import {IconMapperService} from "../shared/ui/icon-mapper.service";
import {ToolbarService} from "../shared/ui/toolbar.service";

/**
 * Created by wanur on 05/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule.forRoot()],
  declarations: [PersonListComponent, PersonPreviewComponent],
  exports: [PersonListComponent, PersonPreviewComponent],
  providers: [TeamService, DialogService, IconMapperService,ToolbarService],
  entryComponents: [PersonDetailComponent]
})
export class PersonListModule {

}
