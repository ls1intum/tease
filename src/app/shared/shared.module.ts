import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentStatisticsService } from './layers/business-logic-layer/student-statistics.service';
import { ConstraintAccessService } from './layers/data-access-layer/constraint.access.service';
import { KeyValueConstraintAccessService } from './layers/data-access-layer/keyvalue.constraint.access.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [],
  exports: [CommonModule, FormsModule, RouterModule],
  providers: [StudentStatisticsService, { provide: ConstraintAccessService, useClass: KeyValueConstraintAccessService }],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
