import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
export interface ChartCanvasParams {
  ChartOptions:ChartOptions;
  ChartType:ChartType;
  ChartLegend:boolean;
  ChartLabels: string[];
  ChartData: ChartDataset [];
}
