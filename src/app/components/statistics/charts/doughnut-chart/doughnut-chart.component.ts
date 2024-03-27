import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { SkillProficiency } from 'src/app/api/models';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, TooltipModel } from 'chart.js';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.scss',
  standalone: true,
  imports: [BaseChartDirective],
})
export class DoughnutChartComponent implements OnInit, OnChanges {
  private readonly DEFAULT_SUBTITLE = 'Total';
  private defaultCount: number;
  subtitle: string = this.DEFAULT_SUBTITLE;
  count: number;

  @Input({ required: true }) doughnutChartData: ChartConfiguration<'doughnut'>['data'];
  chartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  chartLabels: ChartConfiguration<'doughnut'>['data']['labels'] = Object.values(SkillProficiency);

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
        position: 'nearest',
        external: context => this.introCourseProficiencyChartTooltip(context.tooltip),
      },
    },
    cutout: '75%',
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(): void {
    this.updateData();
  }

  private updateData(): void {
    if (!this.doughnutChartData || !this.doughnutChartData.datasets || !this.doughnutChartData.labels) return;

    const isDataEqual = JSON.stringify(this.chartDatasets) == JSON.stringify(this.doughnutChartData.datasets);
    const isLabelsEqual = JSON.stringify(this.chartLabels) == JSON.stringify(this.doughnutChartData.labels);

    if (isDataEqual && isLabelsEqual) {
      return;
    }

    // this.chartDatasets = this.chartData.datasets;
    const datasets = (this.chartDatasets = this.doughnutChartData.datasets);
    this.chartLabels = this.doughnutChartData.labels;
    this.defaultCount = this.chartDatasets[0].data.reduce((a, b) => a + b, 0);
    this.count = this.defaultCount;
  }

  private introCourseProficiencyChartTooltip(tooltip: TooltipModel<'doughnut'>): void {
    if (tooltip.opacity === 1) {
      this.subtitle = tooltip.title[0];
      this.count = tooltip.dataPoints[0].parsed;
    } else {
      tooltip.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
      this.subtitle = this.DEFAULT_SUBTITLE;
      this.count = this.defaultCount;
    }
    this.changeDetectorRef.detectChanges();
  }
}
