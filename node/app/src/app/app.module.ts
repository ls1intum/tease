import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdIconModule} from '@angular/material';
import {SharedModule} from './shared/shared.module';
import {TeamService} from './shared/layers/business-logic-layer/team.service';
import {ConstraintService} from './shared/layers/business-logic-layer/constraint.service';
import {DashboardModule} from './dashboard/dashboard.module';
import {IconMapperService} from './shared/ui/icon-mapper.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PersonDetailOverlayComponent} from './dashboard/person-detail-overlay/person-detail-overlay.component';
import {OverlayHostDirective} from './overlay-host.directive';
import {OverlayService} from './overlay.service';
import {PersonStatisticsService} from './shared/layers/business-logic-layer/person-statistics.service';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    OverlayHostDirective
  ],
  imports: [
    /* external modules */
    BrowserModule, BrowserAnimationsModule, MdButtonModule, MdIconModule, NgbModule.forRoot(), ChartsModule,
    /* own modules */
    SharedModule, DashboardModule
  ],
  providers: [TeamService, ConstraintService, OverlayService, IconMapperService, PersonStatisticsService],
  bootstrap: [AppComponent],
  entryComponents: [PersonDetailOverlayComponent]
})
export class AppModule { }
