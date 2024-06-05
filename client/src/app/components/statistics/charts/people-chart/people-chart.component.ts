import { Component, Input } from '@angular/core';
import { facPersonThinIcon } from 'src/assets/icons/icons';
import { ChartProjectData } from '../chart-data-formatter/people-chart-data';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-people-chart',
  templateUrl: './people-chart.component.html',
  styleUrl: './people-chart.component.scss',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NgbTooltip, BaseChartDirective],
})
export class PeopleChartComponent {
  @Input({ required: true }) peopleChartData: ChartProjectData[];
  facPersonThinIcon = facPersonThinIcon;

  constructor() {}
}
