import { Component, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import flatpickr from 'flatpickr';
import { DateRange } from '../../../interface/DateRange';
import { DateConvertService } from '../../../services/date-convert-service/date-convert.service';

@Component({
  selector: 'app-card-chart-header',
  templateUrl: './card-chart-header.component.html',
  styleUrl: './card-chart-header.component.css'
})
export class CardChartHeaderComponent implements AfterViewInit{

  @Input() cardTitle:string = '';
  @Input() cardAliasName:string = '';

  @Output() valueToParent = new EventEmitter<any>();

  constructor(
    public date:DateConvertService
  ){}

  ngAfterViewInit(): void {
    flatpickr('#dateRangePicker'+this.cardAliasName, {
      mode: 'range',
      dateFormat: 'Y-m-d',
      onChange: (selectedDates: Date[]) => {
        const date:DateRange = this.date.onDateRangeChange(selectedDates);
        if(date.FromDate !== '' && date.ToDate !== ''){
          this.valueToParent.emit(date);
        }

      },
    });
  }

}
