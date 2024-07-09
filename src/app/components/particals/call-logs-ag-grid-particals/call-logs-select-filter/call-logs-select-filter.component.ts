import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';
import { FeedbackService } from '../../../../services/feedback-service/feedback.service';
import { InternalService } from '../../../../services/internal-service/internal.service';
import { StaticDropdown } from '../../../../interface/StaticDropdown';

@Component({
  selector: 'app-call-logs-select-filter',
  templateUrl: './call-logs-select-filter.component.html',
  styleUrl: './call-logs-select-filter.component.css'
})
export class CallLogsSelectFilterComponent implements IFilterAngularComp {

  private params!: IFilterParams;
  public options: any[] = [];
  public optionParams:{name:'', value:0}[] = [];
  private selectedValue: any = null;

  constructor(private feedbackService: FeedbackService, private internalService:InternalService) {}

  getOptionValue(event:any){
    this.selectedValue = event;
    this.params.filterChangedCallback();
  }

  agInit(params: IFilterParams): void {
    this.params = params;

    // Ensure params.colDef and params.colDef.field are defined
    if (!params.colDef || params.colDef.field === undefined) {
        return; // Exit the method if the field is undefined
    }

    let mappedData: { name: any; value: any; }[] = [];
    const field:string = params.colDef.field; // Store the field value to avoid repetitive access

    // Check if the field exists in the fieldMappings object
    const fieldMapping = this.internalService.fieldMappings[field];

    if (fieldMapping) {
        if (fieldMapping.customMapping) {
            // If there's a custom mapping function defined, use it
            mappedData = fieldMapping.customMapping();
        } else {
            // Access the dataSource using fieldMapping's information, if available
            const dataSourceKey = fieldMapping.dataSource as keyof StaticDropdown; // Adjust as per your structure
            const dataSource = this.internalService.dropdownData[dataSourceKey];
            if (dataSource) { // Ensure dataSource exists before proceeding
                mappedData = this.internalService.mapDataToOptions(dataSource, fieldMapping.nameKey, fieldMapping.valueKey);
            }
        }
    }

    mappedData.unshift(this.internalService.defaultValue);
    this.optionParams = mappedData;
  }

  isFilterActive(): boolean {
    return this.selectedValue !== null && this.selectedValue !== 0; // Assuming 0 is the "Select Option" value
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const field:any = this.params.colDef.field; // e.g., 'pickUp'

    if (!field) {
        return false;
    }

    const fieldMapping = this.internalService.fieldFilterMappings[field];

    if (!fieldMapping) {
        return false;
    }

    // Extract row value based on the data property related to the field
    const rowValue = params.data[fieldMapping.dataProperty];

    // Obtain the filter name using the selected value and the field-specific function
    const filterName = fieldMapping.getFilterName(this.selectedValue);

    // Adjust the comparison based on your actual filter value format and data
    return rowValue === filterName;
  }

  getModel(): any {
    if (this.isFilterActive()) {
      return { value: this.selectedValue };
    } else {
      return null;
    }
  }

  setModel(model: any): void {
    this.selectedValue = model ? model.value : null;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {

  }

}
