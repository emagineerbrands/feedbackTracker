import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DateConvertService } from '../services/date-convert-service/date-convert.service';

@Pipe({
  name: 'formatDate'
})
export class ShortDatePipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe,
    private dateConvertService: DateConvertService
    ) {}



  transform(value: any, formatType: string): string | null {
    if (!value) return null;
    return this.dateConvertService.transform(value, formatType);
  }

}
