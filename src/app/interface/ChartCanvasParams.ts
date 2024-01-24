import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
export interface ChartCanvasParams {
  ChartOptions:ChartOptions;
  ChartType:string;
  ChartLegend:boolean;
  ChartLabels: string[];
  ChartData: ChartDataset [];
}
