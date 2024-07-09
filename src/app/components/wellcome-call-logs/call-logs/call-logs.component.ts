import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColDef, GridApi, ColumnApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsRequest, RowModelType, ModuleRegistry, IDatasource, IGetRowsParams, ColGroupDef, GridOptions  } from 'ag-grid-community';
import { CallLogsActionViewHtmlRenderComponent } from '../../particals/call-logs-ag-grid-particals/call-logs-action-view-html-render/call-logs-action-view-html-render.component';
import { CallLogsCustomDateFilterComponent } from '../../particals/call-logs-ag-grid-particals/call-logs-custom-date-filter/call-logs-custom-date-filter.component';


import { CallLogsSelectFilterComponent } from '../../particals/call-logs-ag-grid-particals/call-logs-select-filter/call-logs-select-filter.component';

import { CallLogsAnchorTagViewHtmlRenderComponent } from '../../particals/call-logs-ag-grid-particals/call-logs-anchor-tag-view-html-render/call-logs-anchor-tag-view-html-render.component';
import { WelcomeCallLogService } from '../../../services/welcome-call-log-service/welcome-call-log.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { DateConvertService } from '../../../services/date-convert-service/date-convert.service';
import { DataExportService } from '../../../services/data-export-service/data-export.service';
import { CallLogForm } from '../../../interface/CallLogForm';
import { CallLogsTableParams } from '../../../interface/CallLogsTableParams';
import { Numbers } from '../../../enum/Numbers.enum';

@Component({
  selector: 'app-call-logs',
  templateUrl: './call-logs.component.html',
  styleUrl: './call-logs.component.css'
})
export class CallLogsComponent {

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  public gridOptions!: GridOptions;
  public pageTitle:string = 'Welcome Calls Tracker';
  public breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': '', 'status':'active'},
  ];
  filtersActive: boolean = false;
  userDetails:any;
  public loadingOverlayComponent;
  public noRowsTemplate = '<span aria-live="polite" aria-atomic="true" style="padding: 10px;">This is a custom \'no rows\' overlay</span>';
  public ignoreNextRequest:boolean = false;

  constructor(
    private router: Router,
    private welcomeCallLogService:WelcomeCallLogService,
    public internalService: InternalService,
    private dateConvertService: DateConvertService,
    private dataExportService: DataExportService,
  ){
    this.userDetails = JSON.parse(localStorage.getItem('authDetails') || 'null');
    this.gridOptions = this.initializeGridOptions();
    this.loadingOverlayComponent = 'agLoadingOverlay';
  }

  public welcomelogsParams:CallLogsTableParams = {
    SortName: 'id',
    SortType: 'desc',
    IsAscending: false,
    RecordsPerPage: 10,
    PageOffset: 0,
    PickUp: 0,
    ReactionLevel: 0,
    Assisted: 0,
    ModifiedBy: 0,
    CustomerName:'',
    OrderNumber:'',
    Download:'False',
    Date:{FromDate:'', ToDate:''},
  };

  initializeGridOptions(): GridOptions {
    return {
      pagination: true,
      rowModelType: 'infinite',
      cacheBlockSize: 100,
      paginationPageSize: 10,
      infiniteInitialRowCount: 100,
      paginationPageSizeSelector: [10, 20, 50, 100],
      context: {
        componentParent: this
      },
      columnDefs: this.getColumnDefs(),
      //datasource: null,
      datasource: this.getDataSource(),
    };
  }

  getColumnDefs(): ColDef[] {
    return [
      { headerName: '#', valueGetter: params => params.data?.serialNumber, field:'id', sortable: true, filter:false, width:Numbers.HUNDRED },
      { headerName: 'Customer Name', valueGetter: params => params.data?.CustomerName, field: 'CustomerName', sortable: false, filter:true },
      { headerName: 'Order Number', cellRenderer:CallLogsAnchorTagViewHtmlRenderComponent, field:'order_number', sortable: true, filter:true },
      { headerName: 'Pick Up', valueGetter: params => params.data?.PickUpName, field:'pickUp', sortable: false, filter:CallLogsSelectFilterComponent },
      { headerName: 'Reaction Level', valueGetter: params => params.data?.ReactionName, field:'reactionLevel', sortable: false, filter:CallLogsSelectFilterComponent },
      { headerName: 'Assisted', valueGetter: params => params.data?.AssistedName, field:'assisted', sortable: false, filter:CallLogsSelectFilterComponent },
      { headerName: 'Modified By', valueGetter: params => params.data?.modified_by, field:'agent', sortable: false, filter:CallLogsSelectFilterComponent  },
      { headerName: 'Date', valueGetter: params => params.data?.date, field:'date', sortable: true, filter: CallLogsCustomDateFilterComponent},
      { headerName: 'Time', valueGetter: params => params.data?.time, sortable: false },
      { headerName: 'Action', cellRenderer: CallLogsActionViewHtmlRenderComponent, sortable: false },
    ];
  }

  getDataSource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => this.fetchData(params)
    };
  }

  fetchData(params: IGetRowsParams) {
    const filterParams = params.filterModel;
    const sortingParams = params.sortModel;
    this.welcomelogsParams.Download = 'False';
    // Update Sorting state
    this.welcomelogsParams.SortName = sortingParams && sortingParams[0] ? sortingParams[0].colId : 'id';
    this.welcomelogsParams.SortType = sortingParams && sortingParams[0] ? sortingParams[0].sort : 'desc';
    // Update filter state
    this.welcomelogsParams.CustomerName = filterParams && filterParams.CustomerName ? filterParams.CustomerName.filter : '';
    this.welcomelogsParams.OrderNumber = filterParams && filterParams.order_number ? filterParams.order_number.filter : '';
    this.welcomelogsParams.RecordsPerPage = this.gridApi.paginationGetPageSize();
    this.welcomelogsParams.PageOffset= this.gridApi.paginationGetCurrentPage() * this.gridApi.paginationGetPageSize();
    this.welcomelogsParams.PickUp = filterParams.pickUp ? filterParams.pickUp.value : 0;
    this.welcomelogsParams.ReactionLevel = filterParams.reactionLevel ? filterParams.reactionLevel.value : 0;
    this.welcomelogsParams.Assisted = filterParams.assisted ? filterParams.assisted.value : 0;
    this.welcomelogsParams.Date.FromDate = (filterParams.date?.FromDate) ? filterParams.date?.FromDate  : '';
    this.welcomelogsParams.Date.ToDate = (filterParams.date?.ToDate) ? filterParams.date?.ToDate  : '';
    this.welcomelogsParams.ModifiedBy = filterParams.agent ? filterParams.agent.value  : '';
    this.gridApi.setGridOption('cacheBlockSize',this.gridApi.paginationGetPageSize());
    this.gridApi.showLoadingOverlay();

    this.welcomeCallLogService.callLogs(this.welcomelogsParams).subscribe({
      next: data => this.processData(data, params, this.welcomelogsParams),
      error: error => {
        console.error('There was an error!', error);
        this.gridApi.showNoRowsOverlay();

        params.failCallback();
      }
    });
  }

  processData(data: any[], params: IGetRowsParams, request:any) {
    // Processing data
    const now = new Date();
    const startSerial = request.PageOffset + 1;
    // Add serial number to each data item

    data.map((d, index) => {
      if(this.internalService.callLogDataExists && Number(d.latest_ticket_id) == this.internalService.CallLogsJsonData.LogId){
        d.modified_by = this.userDetails.name;
        d.modified_date = this.dateConvertService.transform(now, 'customShortDateTime');
        d.json_data.form_json_data = this.mapToFormJsonData(this.internalService.CallLogsJsonData);
        //this.internalService.callLogDataExists = false;
      }
      d.serialNumber = startSerial + index; // Adjust based on your actual data structure
      d.CustomerName = d.json_data.shopify_order_json.customer.first_name+' '+d.json_data.shopify_order_json.customer.last_name;
      if(!d.json_data.form_json_data){
        d.json_data.form_json_data = {
          Agent:0,
          PickUp:0,
          ReactionLevel:0,
          OrderEdit_Assist:0,
        };
      }
      d.PickUpName = this.internalService.getNameFromPickup(d.json_data.form_json_data.PickUp);
      d.ReactionName = this.internalService.getNameFromReaction(d.json_data.form_json_data.ReactionLevel);
      d.AssistedName = this.internalService.getNameFromEditedAssisted(d.json_data.form_json_data.OrderEdit_Assist);
      d.date = this.dateConvertService.transform(d.modified_date, 'shortDate');
      d.time = this.dateConvertService.transform(d.modified_date, 'customTime');
    });
    this.ignoreNextRequest = true;
    params.successCallback(data, data.length ? Number(data[0].order_count) : 0);
    this.gridApi.hideOverlay();
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridApi.addEventListener('filterChanged', this.onFilterChanged.bind(this));
    this.gridApi.sizeColumnsToFit();
  }

  onFilterChanged() {
    // Reset pagination to the first page
    this.gridApi.paginationGoToPage(0);

    // Optionally, reset any custom parameters related to pagination offset here
    // For instance, if you have a custom parameter for tracking offset, reset it
    this.welcomelogsParams.PageOffset = 0;
    let allFilterModels = this.gridApi.getFilterModel();
    this.filtersActive = Object.keys(allFilterModels).length > 0;
    // Now, your fetchData method should handle the request with the reset PageOffset
  }


  clearOptions(){
    this.gridApi.setFilterModel(null);
    this.gridApi.onFilterChanged();
  }

  pageNavigate(id:number){
    this.router.navigate(['/welcome-calls-tracker'], { queryParams: {'log-id': id } });
  }

  mapToFormJsonData(callLogData: any):CallLogForm{
    return {
      Address: callLogData.Address,
      Agent: callLogData.Agent,
      Canada: callLogData.Canada,
      Comment: callLogData.Comment,
      Comments: callLogData.Comments || [],
      CustomerName: callLogData.CustomerName,
      Email: callLogData.Email,
      GorgiasTicket: callLogData.GorgiasTicket,
      LogId: String(callLogData.LogId),
      MIO: callLogData.MIO,
      OrderEdit_Assist: String(callLogData.OrderEdit_Assist),
      PickUp: String(callLogData.PickUp),
      ReactionLevel: String(callLogData.ReactionLevel),
      OrderNumber: callLogData.OrderNumber,
    };
  }

  getDownloadType(type:string){
    let datamap:any[] = [];
    this.welcomelogsParams.Download = 'True';
    this.welcomeCallLogService.callLogs(this.welcomelogsParams).subscribe({
      next:(data) => {
        let allComments: string = '';
        let commentCount = 0;
        data.map((item:any, index:number) => {
          item.srNum = index+1;
          if(!item.json_data.form_json_data){
            item.json_data.form_json_data = {
              Agent:0,
              PickUp:0,
              ReactionLevel:0,
              OrderEdit_Assist:0,
            };
          }
          item.comments?.map((comment:any) => {
            commentCount = commentCount+1;
            allComments += (commentCount)+'. '+comment.comment.replace(/\r?\n|\r/g, ' ')+'. ';
          });
          const logData = {
            "S.No" : item.srNum,
            "Customer Name":item.json_data.shopify_order_json.customer.first_name+' '+item.json_data.shopify_order_json.customer.last_name,
            "Order Number":item.json_data.shopify_order_json.order_number,
            "Pick Up":this.internalService.getNameFromPickup(item.json_data.form_json_data.PickUp),
            "Reaction Level":this.internalService.getNameFromReaction(item.json_data.form_json_data.ReactionLevel),
            "Assisted":this.internalService.getNameFromEditedAssisted(item.json_data.form_json_data.OrderEdit_Assist),
            "Modified By":item.modified_by,
            "Date":this.dateConvertService.transform(item.modified_date, 'shortDate'),
            "Time":this.dateConvertService.transform(item.modified_date, 'customTime'),
            "Comments": allComments
          }
          datamap.push(logData);
        });
        const currentDate = this.dateConvertService.transform(new Date(), 'shortDate');
        const csvTitle = `${this.pageTitle}-${currentDate}.csv`;
        const XlsTitle = `${this.pageTitle}-${currentDate}.xlsx`;
        (type == 'CSV') ? this.dataExportService.exportToCSV(datamap, csvTitle) : this.dataExportService.exportToExcel(datamap, XlsTitle);
      },
      error:(error) => {
        console.error('There was an error!', error);
      }
    });

  }

}
