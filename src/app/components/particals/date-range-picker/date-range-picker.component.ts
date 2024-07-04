import { Component, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
