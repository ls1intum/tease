import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TeamComponent } from './team/team.component';
import {MdButtonModule, MdIconModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { PersonPreviewComponent } from './person-preview/person-preview.component';
import {DragulaModule} from 'ng2-dragula';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { PersonDetailOverlayComponent } from './person-detail-overlay/person-detail-overlay.component';
import { TeamScoreComponent } from './team-score/team-score.component';
import { TeamPrioritiesChartComponent } from './team-priorities-chart/team-priorities-chart.component';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule, BrowserAnimationsModule, MdButtonModule, MdIconModule, DragulaModule, FormsModule, NgbModule,
    ChartsModule
  ],
  declarations: [
    DashboardComponent, TeamComponent, PersonPreviewComponent, PersonDetailOverlayComponent, TeamScoreComponent,
    TeamPrioritiesChartComponent
  ],
  exports: [DashboardComponent, PersonDetailOverlayComponent]
})
export class DashboardModule { }
