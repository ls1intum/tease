import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {TeamAccessService} from './layers/data-access-layer/team.access.service';
import {PersistentTeamAccessService} from './layers/data-access-layer/csv.team.access.service';
import {PersonStatisticsService} from './layers/business-logic-layer/person-statistics.service';
import {ConstraintAccessService} from './layers/data-access-layer/constraint.access.service';
import {KeyValueConstraintAccessService} from './layers/data-access-layer/keyvalue.constraint.access.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [],
  exports: [
    CommonModule, FormsModule, RouterModule],
  providers: [ PersonStatisticsService,
    {provide: TeamAccessService, useClass: PersistentTeamAccessService},
    {provide: ConstraintAccessService, useClass: KeyValueConstraintAccessService}
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
