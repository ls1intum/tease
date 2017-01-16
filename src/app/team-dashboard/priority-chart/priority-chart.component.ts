import {Component, Input} from "@angular/core";
import {Person} from "../../shared/models/person"
import 'chart.js'
import {PersonStatisticsService} from "../../shared/layers/business-logic-layer/person-statistics.service";
import {ArrayHelper} from "../../shared/helpers/array.helper";
import {Team} from "../../shared/models/team";

/**
 * Created by Malte Bucksch on 16/01/2017.
 */


@Component({
  templateUrl: './priority-chart.component.html',
  selector: 'priority-chart',
  styleUrls: ['./priority-chart.component.scss'],
})
export class PriorityChartComponent {
  @Input()
  private team: Team;

  constructor(private personStatisticsService: PersonStatisticsService) {
  }

  private datasets = [
    {
      label: "# of persons",
      data: [12, 19, 3, 5, 2, 3]
    }
  ];

  getDataset(): {label: string; data: number[]}[] {
    let priorities = ArrayHelper.createNumberRange(this.personStatisticsService.getPriorityCountMax(this.team));
    let priorityCount = priorities.map(prio =>
      this.personStatisticsService.getNumberOfPersonsForPriority(prio, this.team));

    return [{label: "# of persons", data: priorityCount}];
  }

  getLabels(): string[]{
    let priorities = ArrayHelper.createNumberRange(this.personStatisticsService.getPriorityCountMax(this.team));

    return priorities.map(prio => String(prio+1));
  }
}
