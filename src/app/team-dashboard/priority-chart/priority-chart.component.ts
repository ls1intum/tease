import {Component, Input} from "@angular/core";
import {Person} from "../../shared/models/person"
import 'chart.js'

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
  private persons: Person[];

  constructor() {
  }

  private datasets = [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3]
    }
  ];

  private labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  private options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
}
