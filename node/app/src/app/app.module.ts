import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MdButtonModule, MdIconModule} from '@angular/material';
import {SharedModule} from './shared/shared.module';
import {TeamService} from './shared/layers/business-logic-layer/team.service';
import {ConstraintService} from './shared/layers/business-logic-layer/constraint.service';
import {DashboardModule} from './dashboard/dashboard.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PersonDetailOverlayComponent} from './dashboard/person-detail-overlay/person-detail-overlay.component';
import {OverlayHostDirective} from './overlay-host.directive';
import {OverlayService} from './overlay.service';
import {PersonStatisticsService} from './shared/layers/business-logic-layer/person-statistics.service';
import {ChartsModule} from 'ng2-charts';
import {ImportOverlayComponent} from './dashboard/import-overlay/import-overlay.component';
import {ConstraintsOverlayComponent} from './dashboard/constraints-overlay/constraints-overlay.component';
import {TeamGenerationService} from './shared/layers/business-logic-layer/team-generation/team-generation.service';
import {LPTeamGenerationService} from './shared/layers/business-logic-layer/team-generation/lp-team-generation.service';
import {ConfirmationOverlayComponent} from './dashboard/confirmation-overlay/confirmation-overlay.component';
import {PersonHighlightingOverlayComponent} from './dashboard/person-highlighting-overlay/person-highlighting-overlay.component';
import { HighlightingToolbarComponent } from './highlighting-toolbar/highlighting-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    OverlayHostDirective,
    HighlightingToolbarComponent
  ],
  imports: [
    /* external modules */
    BrowserModule, BrowserAnimationsModule, MdButtonModule, MdIconModule, NgbModule.forRoot(), ChartsModule,
    /* own modules */
    SharedModule, DashboardModule
  ],
  providers: [
    TeamService, ConstraintService, OverlayService, PersonStatisticsService,
    {provide: TeamGenerationService, useClass: LPTeamGenerationService}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    PersonDetailOverlayComponent, ImportOverlayComponent, ConstraintsOverlayComponent, ConfirmationOverlayComponent,
    PersonHighlightingOverlayComponent
  ]
})
export class AppModule { }
