import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamComponent } from './team/team.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonPreviewComponent } from './person-preview/person-preview.component';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PersonDetailOverlayComponent } from './person-detail-overlay/person-detail-overlay.component';
import { TeamStatisticsComponent } from './team-statistics/team-statistics.component';
import { TeamPrioritiesChartComponent } from './team-priorities-chart/team-priorities-chart.component';
import { ImportOverlayComponent } from './import-overlay/import-overlay.component';
import { ConstraintsOverlayComponent } from './constraints-overlay/constraints-overlay.component';
import { ConstraintComponent } from './constraint/constraint.component';
import { ConfirmationOverlayComponent } from './confirmation-overlay/confirmation-overlay.component';
import { PersonPoolStatisticsComponent } from './person-pool-statistics/person-pool-statistics.component';
import { PersonHighlightingOverlayComponent } from './person-highlighting-overlay/person-highlighting-overlay.component';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { ExportOverlayComponent } from './export-overlay/export-overlay.component';
import { PersonDetailCardComponent } from './person-detail-card/person-detail-card.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    DragulaModule.forRoot(),
    FormsModule,
    NgbModule,
    MatSelectModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent,
    TeamComponent,
    PersonPreviewComponent,
    PersonDetailOverlayComponent,
    TeamStatisticsComponent,
    TeamPrioritiesChartComponent,
    ImportOverlayComponent,
    ConstraintsOverlayComponent,
    ConstraintComponent,
    ConfirmationOverlayComponent,
    PersonPoolStatisticsComponent,
    PersonHighlightingOverlayComponent,
    IntroCardComponent,
    ExportOverlayComponent,
    PersonDetailCardComponent,
  ],
  exports: [DashboardComponent, PersonDetailOverlayComponent, ImportOverlayComponent],
  providers: [],
})
export class DashboardModule {}
