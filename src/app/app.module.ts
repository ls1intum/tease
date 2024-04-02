import { NgModule, Provider, forwardRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { ComponentsModule } from './components/components.module';
import { ApiModule } from './api/api.module';

import { TeamService } from './shared/layers/business-logic-layer/team.service';
import { ConstraintService } from './shared/layers/business-logic-layer/constraint.service';
import { OverlayService } from './overlay.service';
import { PersonStatisticsService } from './shared/layers/business-logic-layer/person-statistics.service';

import { PromptService } from './shared/services/prompt.service';

import { OverlayHostDirective } from './overlay-host.directive';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { teaseIconPack } from 'src/assets/icons/icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true,
};

@NgModule({
  declarations: [AppComponent, OverlayHostDirective],
  imports: [
    /* external modules */
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    DragulaModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    /* own modules */
    SharedModule,
    ComponentsModule,
    environment.production ? ApiModule : ApiModule.forRoot({ rootUrl: 'http://localhost:3001/api/tease' }),
    FontAwesomeModule,
  ],
  providers: [
    TeamService,
    ConstraintService,
    OverlayService,
    PersonStatisticsService,
    PromptService,
    AuthInterceptor,
    API_INTERCEPTOR_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(teaseIconPack);
  }
}
