import { Component, Input } from '@angular/core';
import { facPersonThinIcon } from 'src/assets/icons/icons';
import { PeopleChartProjectData } from '../chart-data-formatter/people-chart-data';

@Component({
  selector: 'app-people-chart',
  templateUrl: './people-chart.component.html',
  styleUrl: './people-chart.component.scss',
})
export class PeopleChartComponent {
  @Input({ required: true }) peopleChartData: PeopleChartProjectData[];
  facPersonThinIcon = facPersonThinIcon;

  constructor() {}
}
