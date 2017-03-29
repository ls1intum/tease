import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MaterialModule} from "@angular/material";
import {TeamDashboardComponent} from "./dashboard/team-dashboard.component";
import {TeamService} from "../shared/layers/business-logic-layer/team.service";
import {PersonDetailComponent} from "../person-details/details/person-detail.component";
import {DragulaModule} from "ng2-dragula/ng2-dragula";
import {PersonListModule} from "../person-list/person-list.module";
import {DragulaService} from "ng2-dragula/components/dragula.provider";
import {TeamContainerComponent} from "./container/team-container.component";
import {DialogService} from "../shared/ui/dialog.service";
import {ToolbarService} from "../shared/ui/toolbar.service";
import {PersonDetailModule} from "../person-details/person-detail.module";
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {PriorityChartComponent} from "./priority-chart/priority-chart.component";
import {ConstraintService} from "../shared/layers/business-logic-layer/constraint.service";
import {TeamScoreComponent} from "./team-score/team-score.component";
import {PersonStatisticsService} from "../shared/layers/business-logic-layer/person-statistics.service";

/**
 * Created by Malte Bucksch on 25/11/2016.
 */
@NgModule({
  imports: [CommonModule, MaterialModule, DragulaModule, PersonDetailModule,
    PersonListModule, ChartsModule],
  declarations: [TeamDashboardComponent, TeamContainerComponent, PriorityChartComponent, TeamScoreComponent],
  exports: [TeamDashboardComponent],
  providers: [TeamService, ToolbarService, PersonStatisticsService, DragulaService, DialogService, ConstraintService],
  entryComponents: [PersonDetailComponent]
})
export class TeamDashboardModule {

}