import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {MaterialModule} from "@angular/material";
import {PersonDataImporterComponent} from "./person-data-importer.component";
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import {FileUploadModule} from "ng2-file-upload";
import {PersonService} from "../shared/layers/business-logic-layer/person.service";

/**
 * Created by wanur on 18/11/2016.
 */

@NgModule({
  imports: [CommonModule, SharedModule,  MaterialModule.forRoot()],
  declarations: [PersonDataImporterComponent],
  exports: [PersonDataImporterComponent],
  providers: [PersonService]

})
export class PersonDataImporterModule {}
