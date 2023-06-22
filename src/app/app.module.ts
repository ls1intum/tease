import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';

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
import { PersonDetailOverlayComponent } from './dashboard/person-detail-overlay/person-detail-overlay.component';
import { OverlayHostDirective } from './overlay-host.directive';
import { OverlayService } from './overlay.service';
import { PersonStatisticsService } from './shared/layers/business-logic-layer/person-statistics.service';
import { NgChartsModule } from 'ng2-charts';
import { DragulaModule } from 'ng2-dragula';
import { ImportOverlayComponent } from './dashboard/import-overlay/import-overlay.component';
import { ConstraintsOverlayComponent } from './dashboard/constraints-overlay/constraints-overlay.component';
import { TeamGenerationService } from './shared/layers/business-logic-layer/team-generation/team-generation.service';
import { LPTeamGenerationService } from './shared/layers/business-logic-layer/team-generation/lp-team-generation.service';
import { ConfirmationOverlayComponent } from './dashboard/confirmation-overlay/confirmation-overlay.component';
import { StudentHighlightingOverlayComponent } from './dashboard/student-highlighting-overlay/student-highlighting-overlay.component';
import { HighlightingToolbarComponent } from './highlighting-toolbar/highlighting-toolbar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ExportOverlayComponent } from './dashboard/export-overlay/export-overlay.component';
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
    NgChartsModule,
    AppRoutingModule,
    HammerModule,
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
  entryComponents: [
    PersonDetailOverlayComponent,
    ImportOverlayComponent,
    ConstraintsOverlayComponent,
    ConfirmationOverlayComponent,
    StudentHighlightingOverlayComponent,
    ExportOverlayComponent,
  ],
})
export class AppModule {}
