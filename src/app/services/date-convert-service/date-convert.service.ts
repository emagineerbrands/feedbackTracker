import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { DateRange } from '../../interface/DateRange';

@Injectable({
  providedIn: 'root'
})
export class DateConvertService {

  constructor(private datePipe: DatePipe) { }

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

  transform(value: any, formatType: string): string | null {
    if (!value) return null;

    switch (formatType) {
      case 'shortDate':
        // MM-dd-yyyy
        return this.datePipe.transform(value, 'MM-dd-yyyy');
      case 'shortTime':
        // shortTime format
        return this.datePipe.transform(value, 'shortTime');
      case 'customShortDate':
        // Add your custom format or refer to an existing format
        return this.datePipe.transform(value, 'MM/dd/yy');
      case 'customShortDateTime':
        // Add your custom format or refer to an existing format
        return this.datePipe.transform(value, 'M/d/yyyy h:mm:ss a');
      case 'customDateTime':
        // Add your custom format or refer to an existing format
        return this.datePipe.transform(value, 'MM-dd-yyyy h:mm:ss a');
      case 'customTimeSeconds':
        // Add your custom format or refer to an existing format
        return this.datePipe.transform(value, 'h:mm:ss a');
      case 'customTime':
        // Add your custom format or refer to an existing format
        return this.datePipe.transform(value, 'h:mm a');
      default:
        return this.datePipe.transform(value, formatType);
    }
  }
}
