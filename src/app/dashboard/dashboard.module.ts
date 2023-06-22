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
import { StudentPreviewComponent } from './student-preview/student-preview.component';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { StudentDetailOverlayComponent } from './student-detail-overlay/student-detail-overlay.component';
import { ProjectStatisticsComponent } from './project-statistics/project-statistics.component';
import { ProjectPrioritiesChartComponent } from './project-priorities-chart/project-priorities-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { ImportOverlayComponent } from './import-overlay/import-overlay.component';
import { ConstraintsOverlayComponent } from './constraints-overlay/constraints-overlay.component';
import { ConstraintComponent } from './constraint/constraint.component';
import { ConfirmationOverlayComponent } from './confirmation-overlay/confirmation-overlay.component';
import { StudentPoolStatisticsComponent } from './student-pool-statistics/student-pool-statistics.component';
import { StudentHighlightingOverlayComponent } from './student-highlighting-overlay/student-highlighting-overlay.component';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { ExportOverlayComponent } from './export-overlay/export-overlay.component';
import { StudentDetailCardComponent } from './student-detail-card/student-detail-card.component';
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
    NgChartsModule,
    MatSelectModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DashboardComponent,
    TeamComponent,
    StudentPreviewComponent,
    StudentDetailOverlayComponent,
    ProjectStatisticsComponent,
    ProjectPrioritiesChartComponent,
    ImportOverlayComponent,
    ConstraintsOverlayComponent,
    ConstraintComponent,
    ConfirmationOverlayComponent,
    StudentPoolStatisticsComponent,
    StudentHighlightingOverlayComponent,
    IntroCardComponent,
    ExportOverlayComponent,
    StudentDetailCardComponent,
  ],
  exports: [DashboardComponent, StudentDetailOverlayComponent, ImportOverlayComponent],
  providers: [],
})
export class DashboardModule {}
