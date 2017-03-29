import {NgModule} from '@angular/core'
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";
import {AppComponent} from "./app.component";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {PersonDetailModule} from "./person-details/person-detail.module";
import {PersonListModule} from "./person-list/person-list.module";
import {MaterialModule} from "@angular/material";
import {PersonDataImporterModule} from "./person-data-importer/person-data-importer.module";
import {TeamDashboardModule} from "./team-dashboard/team-dashboard.module";
import {DragulaModule} from "ng2-dragula/ng2-dragula";
import {TeamGenerationModule} from "./team-generation/team-generation.module";

@NgModule({
  declarations: [AppComponent],
  imports     : [BrowserModule,
    FormsModule, HttpModule,
    RouterModule.forRoot(rootRouterConfig,  {useHash: false}),
  PersonDetailModule, PersonDataImporterModule,
  PersonListModule,TeamDashboardModule,TeamGenerationModule, MaterialModule, DragulaModule],
  providers   : [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap   : [AppComponent],
})
export class AppModule {

}