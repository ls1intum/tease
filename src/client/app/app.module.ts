import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import {PersonDetailModule} from "./person-details/person-detail.module";
import {PersonListModule} from "./person-list/person-list.module";

@NgModule({
  imports: [BrowserModule, HttpModule, RouterModule.forRoot(routes), PersonDetailModule, PersonListModule,
    HomeModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})

export class AppModule { }
