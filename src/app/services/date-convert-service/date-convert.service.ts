import { Injectable } from '@angular/core';
import { DateRange } from '../../interface/DateRange';

@Injectable({
  providedIn: 'root'
})
export class DateConvertService {

  constructor() { }

  // flatpickr date range ["2023-12-31T18:30:00.000Z","2024-01-09T18:30:00.000Z"] to [y-m-d, y-m-d]

  onDateRangeChange(selectedDates: Date[]):DateRange {
    const dateRange = {FromDate:'', ToDate:''};
    if (selectedDates.length === 2) {
      dateRange.FromDate = this.formatDate(selectedDates[0]);
      dateRange.ToDate = this.formatDate(selectedDates[1]);
    }
    return dateRange;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
