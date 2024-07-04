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
export class ChartTableComponent {

  @Input() cardBackground:string = '';
  @Input() cardTitle:string = '';
  @Input() heightClass:string = '';
  @Input() cardAliasName:string = '';
  @Input() chartTableData:any;
  @Input() defaultChartData:any;
  @Input() chartOptions:ChartOptions | undefined;
  @Input() chartLegend:boolean = false;
  @Input() chartType!:ChartType;
  @Input() chartData:ChartDataset []= [];
  @Input() chartLabels:string[] = [];
  @Input() canvaHeight:number = 0;
  @Input() chartDataExist:boolean = true;

  @Output() valueToParent = new EventEmitter<any>();

  constructor(
    public dateConvertService:DateConvertService
  ){}

  valueToParentParent(event:DateRange){
    this.valueToParent.emit(event);
  }





}
