import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@angular/material";
import {ConstraintsComponent} from "./constraints/constraints.component";
import {SharedModule} from "../shared/shared.module";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
import {ToolbarService} from "../shared/ui/toolbar.service";
import {TeamGenerationService} from "../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {BalancedTeamGenerationService} from "../shared/layers/business-logic-layer/team-generation/balanced-team-generation.service";
@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule],
  declarations: [ConstraintsComponent],
  exports: [ConstraintsComponent],
  providers: [TeamService, ToolbarService,
    {provide: TeamGenerationService, useClass: BalancedTeamGenerationService}]
})
export class TeamGenerationModule {

}
