import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css'
})
export class DateRangePickerComponent {

  @Input() fromDate!: NgbDateStruct | null;
  @Input() toDate!: NgbDateStruct | null;

  @Output() DateRangePicker = new EventEmitter<any>();

  constructor() {}

  onDateRangeChange() {
    if (this.fromDate && this.toDate) {
      //DateRange.FromDatePicker:NgbDateStruct = this.fromDate;
      //DateRange.ToDatePicker = this.toDate;
      this.DateRangePicker.emit({ fromDate: this.fromDate, toDate: this.toDate });
    }
  }

}
