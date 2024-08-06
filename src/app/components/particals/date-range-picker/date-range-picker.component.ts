import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ChangeDetectorRef   } from '@angular/core';
import { NgbDateStruct , NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.css'
})
export class DateRangePickerComponent implements OnInit{

  @Input() fromDate!: NgbDateStruct | null;
  @Input() toDate!: NgbDateStruct | null;

  @Output() DateRangePicker = new EventEmitter<any>();

  constructor(private config: NgbDatepickerConfig, private cdr: ChangeDetectorRef) {
    //this.dateConfig();
  }

  ngOnInit() {
    this.dateConfig();
  }

  ngAfterViewInit(){
    //this.dateConfig();
  }

  dateConfig(){
    const today = new Date();
    const utcDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const defaultDate: NgbDateStruct = {
      year: utcDate.getUTCFullYear(),
      month: utcDate.getUTCMonth() + 1, // NgbDateStruct months are 1-based
      day: utcDate.getUTCDate(),
    };
    // Set the default view date in the datepicker without populating the input fields
    this.config.startDate = defaultDate;
    //this.cdr.detectChanges();

  }

  onDateRangeChange() {
    if (this.fromDate && this.toDate) {
      //DateRange.FromDatePicker:NgbDateStruct = this.fromDate;
      //DateRange.ToDatePicker = this.toDate;
      this.DateRangePicker.emit({ fromDate: this.fromDate, toDate: this.toDate });
    }
  }

}
