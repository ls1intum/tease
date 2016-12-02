import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "@angular/material";
import {PersonDataImporterComponent} from "./person-data-importer.component";
import {PersonService} from "../shared/layers/business-logic-layer/services/person.service";
import {PersonDetailComponent} from "../person-details/person-detail.component";
import {TeamService} from "../shared/layers/business-logic-layer/services/team.service";

/**
 * Created by wanur on 18/11/2016.
 */

@NgModule({
  imports: [CommonModule, SharedModule,  MaterialModule.forRoot()],
  declarations: [PersonDataImporterComponent],
  exports: [PersonDataImporterComponent],
  providers: [TeamService],
  entryComponents: [PersonDetailComponent]
})
export class PersonDataImporterModule {}
