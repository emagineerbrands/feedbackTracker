// @ts-ignore
import { Component } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  public barChartLabels: string[] = ['Category 1', 'Category 2', 'Category 3'];
  public barChartType: string = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataset [] = [
    { data: [10, 20, 30], label: 'Series A' },
    { data: [15, 25, 35], label: 'Series B' },
    // Add more series for stacked bars
  ];

  ngOnInit() {
    // Initialize your chart with a default type if needed
    // this.barChartType = 'bar';
  }

  // Map string to ChartType
  getChartType(): ChartType {
    return this.barChartType as ChartType;
  }
}
