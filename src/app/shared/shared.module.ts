import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {TeamService} from "./layers/business-logic-layer/services/team.service";
import {TeamAccessService} from "./layers/data-access-layer/team.access.service";
import {TeamGenerator} from "./layers/business-logic-layer/team_generation/TeamGenerator";
import {DummyTeamGenerator} from "./layers/business-logic-layer/team_generation/DummyTeamGenerator";
import {PersistentTeamAccessService} from "./layers/data-access-layer/persistent-team-access.service";
import {DialogService} from "./ui/dialog.service";
import {MaterialModule} from "@angular/material";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule.forRoot()],
  declarations: [],
  exports: [
    CommonModule, FormsModule, RouterModule],
  providers: [
    {provide: TeamAccessService, useClass: PersistentTeamAccessService},
    {provide: TeamGenerator, useClass: DummyTeamGenerator}
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [DialogService]
    };
  }
}
