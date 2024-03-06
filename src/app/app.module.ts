import { NgModule, Provider, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';

import { AppComponent } from './app.component';
import { HighlightingToolbarComponent } from './highlighting-toolbar/highlighting-toolbar.component';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ApiModule } from './api/api.module';

import { TeamService } from './shared/layers/business-logic-layer/team.service';
import { ConstraintService } from './shared/layers/business-logic-layer/constraint.service';
import { OverlayService } from './overlay.service';
import { PersonStatisticsService } from './shared/layers/business-logic-layer/person-statistics.service';
import { TeamGenerationService } from './shared/layers/business-logic-layer/team-generation/team-generation.service';
import { LPTeamGenerationService } from './shared/layers/business-logic-layer/team-generation/lp-team-generation.service';
import { PromptService } from './shared/services/prompt.service';

import { OverlayHostDirective } from './overlay-host.directive';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true,
};

@NgModule({
  declarations: [AppComponent, OverlayHostDirective, HighlightingToolbarComponent],
  imports: [
    /* external modules */
    BrowserModule,
    MatButtonModule,
    MatIconModule,
    NgbModule,
    AppRoutingModule,
    DragulaModule.forRoot(),
    ReactiveFormsModule,
    MatTooltipModule,
    HttpClientModule,
    /* own modules */
    SharedModule,
    DashboardModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    environment.production ? ApiModule : ApiModule.forRoot({ rootUrl: 'http://localhost:3001/tease' }),
  ],
  providers: [
    TeamService,
    ConstraintService,
    OverlayService,
    PersonStatisticsService,
    PromptService,
    AuthInterceptor,
    API_INTERCEPTOR_PROVIDER,
    [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
    { provide: TeamGenerationService, useClass: LPTeamGenerationService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
