import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamComponent } from './team/team.component';
import {MdButtonModule, MdIconModule, MdSlideToggleModule, MdTooltipModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PersonPreviewComponent } from './person-preview/person-preview.component';
import {DragulaModule} from 'ng2-dragula';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { PersonDetailOverlayComponent } from './person-detail-overlay/person-detail-overlay.component';
import { TeamStatisticsComponent } from './team-statistics/team-statistics.component';
import { TeamPrioritiesChartComponent } from './team-priorities-chart/team-priorities-chart.component';
import {ChartsModule} from 'ng2-charts';
import { ImportOverlayComponent } from './import-overlay/import-overlay.component';
import { ConstraintsOverlayComponent } from './constraints-overlay/constraints-overlay.component';
import { ConstraintComponent } from './constraint/constraint.component';
import {ConfirmationOverlayComponent} from './confirmation-overlay/confirmation-overlay.component';
import { PersonPoolStatisticsComponent } from './person-pool-statistics/person-pool-statistics.component';
import { PersonHighlightingOverlayComponent } from './person-highlighting-overlay/person-highlighting-overlay.component';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { ExportOverlayComponent } from './export-overlay/export-overlay.component';

@NgModule({
  imports: [
    CommonModule, BrowserAnimationsModule, MdButtonModule, MdIconModule, MdSlideToggleModule, MdTooltipModule,
    DragulaModule, FormsModule, NgbModule, ChartsModule, MatSelectModule
  ],
  declarations: [
    DashboardComponent, TeamComponent, PersonPreviewComponent, PersonDetailOverlayComponent, TeamStatisticsComponent,
    TeamPrioritiesChartComponent, ImportOverlayComponent, ConstraintsOverlayComponent, ConstraintComponent,
    ConfirmationOverlayComponent,
    PersonPoolStatisticsComponent,
    PersonHighlightingOverlayComponent,
    IntroCardComponent,
    ExportOverlayComponent
  ],
  exports: [DashboardComponent, PersonDetailOverlayComponent, ImportOverlayComponent],
  providers: [],
})
export class DashboardModule { }
