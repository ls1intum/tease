import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragulaModule } from 'ng2-dragula';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ImportOverlayComponent } from './import-overlay/import-overlay.component';
import { ConfirmationOverlayComponent } from './confirmation-overlay/confirmation-overlay.component';
import { IntroCardComponent } from './intro-card/intro-card.component';
import { ExportOverlayComponent } from './export-overlay/export-overlay.component';
import { PersonDetailOverlayComponent } from './person-detail-overlay/person-detail-overlay.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentPreviewCardComponent } from './student-preview-card/student-preview-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProjectsComponent } from './projects/projects.component';
import { StatisticsModule } from './statistics/statistics.module';
import { UtilityComponent } from './utility/utility.component';
import { ConstraintBuilderComponent } from './constraint-builder-overlay/constraint-builder.component';
import { ConstraintsOverlayComponent } from './constraints-overlay/constraints-overlay.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { ConstraintBuilder2Component } from './constraint-builder-2/constraint-builder-2.component';

@NgModule({
  declarations: [
    ImportOverlayComponent,
    ConfirmationOverlayComponent,
    IntroCardComponent,
    ExportOverlayComponent,
    PersonDetailOverlayComponent,
    StudentPreviewCardComponent,
    ProjectsComponent,
    UtilityComponent,
    ConstraintBuilderComponent,
    ConstraintsOverlayComponent,
    NavigationBarComponent,
    ConstraintBuilder2Component,
  ],
  exports: [NavigationBarComponent, ProjectsComponent, UtilityComponent, IntroCardComponent],
  providers: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    DragulaModule.forRoot(),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    StatisticsModule,
  ],
})
export class ComponentsModule {}
