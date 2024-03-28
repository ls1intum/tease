import { NgModule } from '@angular/core';
import { StatisticsComponent } from './statistics.component';
import { DoughnutChartComponent } from './charts/doughnut-chart/doughnut-chart.component';
import { PeopleChartComponent } from './charts/people-chart/people-chart.component';
import { CommonModule } from '@angular/common';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, FontAwesomeModule, NgbModule, DoughnutChartComponent],
  declarations: [StatisticsComponent, PeopleChartComponent],
  providers: [provideCharts(withDefaultRegisterables())],
  exports: [StatisticsComponent],
})
export class StatisticsModule {}
