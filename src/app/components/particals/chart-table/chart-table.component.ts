import { Component, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import flatpickr from 'flatpickr';
import { ChartCanvasParams } from '../../../interface/ChartCanvasParams';
import { DateRange } from '../../../interface/DateRange';
import { DateConvertService } from '../../../services/date-convert-service/date-convert.service';

@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrl: './chart-table.component.css'
})
export class ChartTableComponent implements AfterViewInit {

  @Input() cardBackground:string = '';
  @Input() cardTitle:string = '';
  @Input() cardAliasName:string = '';
  @Input() chartTableData:any;
  @Input() defaultChartData:any;
  @Input() chartOptions:ChartOptions | undefined;
  @Input() chartLegend:boolean = false;
  @Input() chartType:string = '';
  @Input() chartData:ChartDataset []= [];
  @Input() chartLabels:string[] = [];
  @Input() canvaHeight:number = 0;

  @Output() valueToParent = new EventEmitter<any>();

  constructor(
    public date:DateConvertService
  ){

  }

  ngAfterViewInit(): void {
    flatpickr('#dateRangePicker'+this.cardAliasName, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      onChange: (selectedDates: Date[]) => {
        const date:DateRange = this.date.onDateRangeChange(selectedDates);
        if(date.FromDate !== '' && date.ToDate !== ''){
          this.valueToParent.emit(date);
          //console.log('Test', date);
        }

      },
    });
  }

  getColumnHeaders(data: any): string[]{
    return Object.keys(data);
  }



}
