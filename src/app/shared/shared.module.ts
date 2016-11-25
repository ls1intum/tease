import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {PersonService} from "./layers/business-logic-layer/person.service";
import {TeamService} from "./layers/business-logic-layer/team.service";
import {PersonAccessService} from "./layers/data-access-layer/person.access.service";
import {NonPersistentPersonAccessService} from "./layers/data-access-layer/non-persistent-person.access.service";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [],
  exports: [
    CommonModule, FormsModule, RouterModule],
  providers: [{provide: PersonAccessService, useClass: NonPersistentPersonAccessService}]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [PersonService, TeamService]
    };
  }
}
