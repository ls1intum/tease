import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupByPipe } from './pipes/group-by.pipe';
import { IncludesPipe } from './pipes/includes.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, GroupByPipe, IncludesPipe],
  declarations: [],
  exports: [CommonModule, GroupByPipe, IncludesPipe],
  providers: [],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
