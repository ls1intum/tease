import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {CustomPersonDetailDialogService} from './shared/ui/custom-person-detail-dialog.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdIconModule} from '@angular/material';
import {SharedModule} from './shared/shared.module';
import {TeamService} from './shared/layers/business-logic-layer/team.service';
import {ConstraintService} from './shared/layers/business-logic-layer/constraint.service';
import {DashboardModule} from './dashboard/dashboard.module';
import {IconMapperService} from './shared/ui/icon-mapper.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule, MdButtonModule, MdIconModule, NgbModule.forRoot(), /* external modules */
    SharedModule, DashboardModule /* own modules */
  ],
  providers: [TeamService, ConstraintService, CustomPersonDetailDialogService, IconMapperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
