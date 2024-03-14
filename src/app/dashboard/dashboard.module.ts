import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PersonDetailOverlayComponent } from './person-detail-overlay/person-detail-overlay.component';
import { TeamStatisticsComponent } from './team-statistics/team-statistics.component';
import { TeamPrioritiesChartComponent } from './team-priorities-chart/team-priorities-chart.component';
import { ImportOverlayComponent } from './import-overlay/import-overlay.component';
import { ConfirmationOverlayComponent } from './confirmation-overlay/confirmation-overlay.component';
import { PersonPoolStatisticsComponent } from './person-pool-statistics/person-pool-statistics.component';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { ExportOverlayComponent } from './export-overlay/export-overlay.component';
import { PersonDetailCardComponent } from './person-detail-card/person-detail-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { StudentPreviewCardComponent } from './student-preview-card/student-preview-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectsComponent } from './projects/projects.component';

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
    MatTabsModule,
    FontAwesomeModule,
  ],
  declarations: [
    DashboardComponent,
    PersonDetailOverlayComponent,
    TeamStatisticsComponent,
    TeamPrioritiesChartComponent,
    ImportOverlayComponent,
    ConfirmationOverlayComponent,
    PersonPoolStatisticsComponent,
    IntroCardComponent,
    ExportOverlayComponent,
    PersonDetailCardComponent,
    StudentPreviewCardComponent,
    ProjectsComponent,
  ],
  exports: [DashboardComponent, PersonDetailOverlayComponent, ImportOverlayComponent],
  providers: [],
})
export class DashboardModule {}
