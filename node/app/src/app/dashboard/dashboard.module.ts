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

@NgModule({
  imports: [
    CommonModule, BrowserAnimationsModule, MdButtonModule, MdIconModule, DragulaModule, FormsModule, NgbModule
  ],
  declarations: [DashboardComponent, TeamComponent, PersonPreviewComponent, PersonDetailOverlayComponent],
  exports: [DashboardComponent, PersonDetailOverlayComponent]
})
export class DashboardModule { }
