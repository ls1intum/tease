import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "@angular/material";
import {PersonDataImporterComponent} from "./person-data-importer.component";
import {PersonDetailComponent} from "../person-details/details/person-detail.component";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../shared/ui/toolbar.service";

/**
 * Created by wanur on 18/11/2016.
 */

@NgModule({
  imports: [CommonModule, SharedModule,  MaterialModule],
  declarations: [PersonDataImporterComponent],
  exports: [PersonDataImporterComponent],
  providers: [TeamService, ToolbarService],
  entryComponents: [PersonDetailComponent]
})
export class PersonDataImporterModule {}
