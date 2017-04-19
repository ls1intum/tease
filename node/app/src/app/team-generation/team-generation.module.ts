import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@angular/material";
import {ConstraintsComponent} from "./constraints/constraints.component";
import {SharedModule} from "../shared/shared.module";
import {TeamGenerationService} from "../shared/layers/business-logic-layer/team-generation/team-generation.service";
import {LPTeamGenerationService} from "../shared/layers/business-logic-layer/team-generation/lp-team-generation.service";
import {ConstraintService} from "../shared/layers/business-logic-layer/constraint.service";
import {FilterConstraintsByTeamNamePipe} from "./filter-constraints-by-team-name.pipe";

@NgModule({
  imports: [CommonModule, SharedModule, MaterialModule],
  declarations: [ConstraintsComponent, FilterConstraintsByTeamNamePipe],
  exports: [ConstraintsComponent],
  providers: [ConstraintService,
    {provide: TeamGenerationService, useClass: LPTeamGenerationService}]
})
export class TeamGenerationModule {

}
