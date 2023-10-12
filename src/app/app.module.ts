import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from './shared/shared.module';
import { TeamService } from './shared/layers/business-logic-layer/team.service';
import { ConstraintService } from './shared/layers/business-logic-layer/constraint.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OverlayHostDirective } from './overlay-host.directive';
import { OverlayService } from './overlay.service';
import { PersonStatisticsService } from './shared/layers/business-logic-layer/person-statistics.service';
import { DragulaModule } from 'ng2-dragula';
import { TeamGenerationService } from './shared/layers/business-logic-layer/team-generation/team-generation.service';
import { LPTeamGenerationService } from './shared/layers/business-logic-layer/team-generation/lp-team-generation.service';
import { HighlightingToolbarComponent } from './highlighting-toolbar/highlighting-toolbar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, OverlayHostDirective, HighlightingToolbarComponent],
  imports: [
    /* external modules */
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    NgbModule,
    AppRoutingModule,
    DragulaModule.forRoot(),
    ReactiveFormsModule,
    /* own modules */
    SharedModule,
    DashboardModule,
  ],
  providers: [
    TeamService,
    ConstraintService,
    OverlayService,
    PersonStatisticsService,
    [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
    { provide: TeamGenerationService, useClass: LPTeamGenerationService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
