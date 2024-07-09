import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IAfterGuiAttachedParams, IFilterParams } from 'ag-grid-community';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-call-logs-custom-date-filter',
  templateUrl: './call-logs-custom-date-filter.component.html',
  styleUrl: './call-logs-custom-date-filter.component.css'
})
export class CallLogsCustomDateFilterComponent implements IFilterAngularComp{

  private params: IFilterParams<any, any> | undefined;
  public dateFrom!: NgbDateStruct | null;
  public dateTo!: NgbDateStruct | null;

  constructor(private formatter: NgbDateParserFormatter) {}

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.dateFrom !== undefined || this.dateTo !== undefined;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // Assuming your date values are directly accessible on the row data
    // and you have a column field specified for dates.
    if(!this.dateFrom && !this.dateTo){
      return true;
    }
    const value = this.params?.api.getValue(this.params.column, params.node);
    const dateValue = value ? new Date(value).getTime() : null;
    const from = this.dateFrom ? new Date(this.dateFrom.year, this.dateFrom.month - 1, this.dateFrom.day).getTime() : null;
    const to = this.dateTo ? new Date(this.dateTo.year, this.dateTo.month - 1, this.dateTo.day, 23, 59, 59, 999).getTime() : null;
    if(!dateValue){
      return false;
    }
    if (from && dateValue && dateValue < from) {
      return false;
    }
    if (to && dateValue && dateValue > to) {
      return false;
    }
    return true;
  }


  getModel() {
    return {FromDate:this.formatter.format(this.dateFrom),ToDate:this.formatter.format(this.dateTo) }
    //return { dateFrom: this.dateFrom, dateTo: this.dateTo };
  }

  setModel(model: any): void {
    this.dateFrom = model ? model.dateFrom : null;
    this.dateTo = model ? model.dateTo : null;
  }

  onDateChanged(): void {
    if ((this.dateFrom && this.dateTo) || (!this.dateFrom && !this.dateTo)) {
      this.params?.filterChangedCallback();
    }
  }

  // Other necessary methods for a custom filter...
  getModelAsString(model: any): string {
    return '';
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    // GUI setup code, if needed
  }
}
