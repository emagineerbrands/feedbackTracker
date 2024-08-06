import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FeedbackFilters } from '../../../interface/FeedbackFilters';
import { PaginationParams } from '../../../interface/PaginationParams';
import { ShortParams } from '../../../interface/ShortParams';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { DataExportService } from '../../../services/data-export-service/data-export.service';
import { DateConvertService } from '../../../services/date-convert-service/date-convert.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';
import { User } from '../../../interface/User';
import { ConfirmationCheckComponent } from '../../model-popup/confirmation-check/confirmation-check.component';
import { ColDef, GridApi, ColumnApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsRequest, RowModelType, ModuleRegistry, IDatasource, IGetRowsParams, ColGroupDef, GridOptions  } from 'ag-grid-community';
import { ExpandableRowRendererComponent } from '../../particals/order-issue-ag-grid-particals/expandable-row-renderer/expandable-row-renderer.component';
import { Numbers } from '../../../enum/Numbers.enum';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.css'
})
export class FeedbackListComponent implements OnInit{

  userDetails:User;

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  public gridOptions!: GridOptions;
  public loadingOverlayComponent;
  public noRowsTemplate = '<span aria-live="polite" aria-atomic="true" style="padding: 10px;">This is a custom \'no rows\' overlay</span>';
  public ignoreNextRequest:boolean = false;
  rowData: any;

  frameworkComponents = {
    viewCellRenderer: ViewCellRendererComponent,
    expandCellRenderer: ExpandCellRendererComponent
  };

  filterParams:FeedbackFilters = {
    OrderNumber:'',
    Agent:0,
    DateRange:{FromDate:'', ToDate:''},
    Complaint:'',
    Solution:'',
    Assignee:'',
    Status:0
  };

  Shorting:ShortParams = { ShortName:'id', ShortType:'desc', IsAscending:false };

  pagination:PaginationParams = {
    RecordsPerPage:10,
    TotalRecords:0,
    PageOffset:0,
    CurrentPage:1,
    TotalPages:0,
    PagesToDisplay:[],
  };
  filtersActive: boolean = false;

  pageTitle:string = 'Order Issues Tracker';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'order-issues-tracker', 'status':'active'},
  ];

  ticketsList:any[] = [];
  tempTicketsList:any[] = [];
  loader:boolean = false;
  complaintTypeList:any[]=[];
  solutionsList:any[]=[];


  constructor(
    private feedbackService: FeedbackService,
    public datePipe: DateConvertService,
    public internalService:InternalService,
    private router: Router,
    private dataExportService: DataExportService,
    private modalService: NgbModal,
    public toaster:ToastNotificationsService
  ){
    this.userDetails = JSON.parse(localStorage.getItem('authDetails') || 'null');
    this.gridOptions = this.initializeGridOptions();
    this.loadingOverlayComponent = 'agLoadingOverlay';
  }

  ngOnInit(): void {
    if(this.internalService.paginationParamsExist){
      this.pagination = this.internalService.pagination;
    }
   // this.getFeedbackList();

  }

  initializeGridOptions(): GridOptions {
    return {
      pagination: true,
      rowModelType: 'infinite',
      cacheBlockSize: 10, // Adjust as necessary
      paginationPageSize: 10, // Adjust as necessary
      infiniteInitialRowCount: 10,
      maxBlocksInCache: 10,
      paginationPageSizeSelector: [10, 20, 50, 100],
      context: {
        componentParent: this
      },
      columnDefs: this.getColumnDefs(),
      datasource: this.getDataSource(),
      rowGroupPanelShow: 'always',
      groupDefaultExpanded: -1, // Expand all groups by default
      autoGroupColumnDef: this.getAutoGroupColumnDef(),
      getRowId: (data:any) => data.id
    };
  }



  getDataSource(): IDatasource {
    return {
      getRows: (params: IGetRowsParams) => this.fetchData(params)
    };
  }

  fetchData(params: IGetRowsParams) {
    const filterParams = params.filterModel;
    const sortingParams = params.sortModel;
    // Map filter params
    this.filterParams.OrderNumber = filterParams.order_number ? filterParams.order_number.filter : '';
    this.filterParams.Agent = filterParams.agent ? filterParams.agent.value : 0;
    this.filterParams.DateRange.FromDate = filterParams.date?.FromDate ? filterParams.date?.FromDate : '';
    this.filterParams.DateRange.ToDate = filterParams.date?.ToDate ? filterParams.date?.ToDate : '';
    this.filterParams.Complaint = filterParams.complaint ? filterParams.complaint.value : '';
    this.filterParams.Solution = filterParams.solution ? filterParams.solution.value : '';
    this.filterParams.Assignee = filterParams.assignee ? filterParams.assignee.value : '';
    this.filterParams.Status = filterParams.status ? filterParams.status.value : 0;
    this.Shorting.ShortName = sortingParams[0] ? sortingParams[0].colId : 'id';
    this.Shorting.ShortType = sortingParams[0] ? sortingParams[0].sort : 'desc';
    this.pagination.RecordsPerPage = this.gridApi.paginationGetPageSize();
    this.pagination.PageOffset = this.gridApi.paginationGetCurrentPage() * this.gridApi.paginationGetPageSize();
    this.gridApi.showLoadingOverlay();
    this.feedbackService.getTickets(this.filterParams, this.pagination, this.Shorting, false).subscribe({
      next: data => {
        this.processData(data, params, this.filterParams, this.pagination, this.Shorting);
      },
      error: error => {
        console.error('There was an error!', error);
        this.gridApi.showNoRowsOverlay();
        params.failCallback();
      }
    });
  }


  processData(data: any[], params: IGetRowsParams, filterParams:FeedbackFilters, pagination:PaginationParams, Shorting:ShortParams){
    let countOfRecords = 0;
    data.map((d:any) => {
      d.expandData = false;
      countOfRecords = Number(d.order_count);
      if(d.json_data.fileUrls && !Array.isArray(d.json_data.fileUrls)){
        d.json_data.fileUrls = JSON.parse(d.json_data.fileUrls);
      }else{
        d.json_data.fileUrls = [];
      }
      d.modified_date = this.datePipe.transform(d.modified_date, 'shortDate');
      d.ticket_details.map((sub_d:any) => {
        if(sub_d.json_data.fileUrls && !Array.isArray(sub_d.json_data.fileUrls)){
          sub_d.json_data.fileUrls = JSON.parse(sub_d.json_data.fileUrls);
        }else{
          sub_d.json_data.fileUrls = [];
        }

        sub_d.json_data.SKUGroup.map((json:any) => {
          if (!Array.isArray(this.complaintTypeList[sub_d.id])) {
            this.complaintTypeList[sub_d.id] = [];
          }
          if (!Array.isArray(this.solutionsList[sub_d.id])) {
            this.solutionsList[sub_d.id] = [];
          }
          const complaintName = this.internalService.getNameFromComplaintList(json.Complaint);
          if (!this.complaintTypeList[sub_d.id].includes(complaintName)) {
            this.complaintTypeList[sub_d.id].push(complaintName);
          }
          const solutionName = this.internalService.getNameFromSolution(json.Solution);
          if (!this.solutionsList[sub_d.id].includes(solutionName)) {
            this.solutionsList[sub_d.id].push(solutionName);
          }
        });
        sub_d.modified_date = this.datePipe.transform(sub_d.modified_date, 'shortDate');
        if(this.internalService.feedbackUpdatePage && sub_d.id === this.internalService.feedbackFormId){
          sub_d.status = (this.internalService.feedbackformPayloadData.status == 1) ? 'Pending' : 'Solved';
        }
      });
    });
    this.rowData = data;
    this.gridApi.hideOverlay();
    params.successCallback(data, countOfRecords);
  }

  getColumnDefs(): ColDef[] {
    return [
      { headerName: '', field: 'expand', cellRenderer: ExpandableRowRendererComponent, width: Numbers.EIGHTY },
      { headerName: 'ID', field: 'latest_ticket_id', sortable: true, filter: true, width: Numbers.HUNDRED },
      { headerName: 'Order Id', field: 'order_number', sortable: true, filter: true },
      { headerName: 'Agent', field: 'modified_by', sortable: true, filter: true },
      { headerName: 'Created Date', field: 'modified_date', sortable: true, filter: true },
      { headerName: 'Complaint Type', field: 'complaintType', sortable: true, filter: true },
      { headerName: 'Solution', field: 'solutions', sortable: true, filter: true },
      { headerName: 'Assignee', field: 'assignee', sortable: true, filter: true },
      { headerName: 'Status', field: 'status', sortable: true, filter: true, cellStyle: this.statusCellStyle },
      { headerName: 'View', cellRenderer: ViewCellRendererComponent },
      { headerName: 'Action', field: 'action', hide: !this.userDetails.role_id.includes(3) }
    ];
  }

  getAutoGroupColumnDef(): ColDef {
    return {
      headerName: 'Group',
      field: 'order_number',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        checkbox: true
      }
    };
  }

  toggleGroupOrders(index: number) {
    if (this.ticketsList[index]) {
      this.ticketsList[index].expandData = !this.ticketsList[index].expandData;
    } else {
      console.error(`Index ${index} is out of range`);
    }
  }

  statusCellStyle(params: any) {
    const status = params.value;
    let style = {};
    switch (status) {
      case 'Onhold':
        style = { backgroundColor: 'blue' };
        break;
      case 'Solved':
        style = { backgroundColor: 'green' };
        break;
      case 'Pending':
        style = { backgroundColor: 'orange' };
        break;
    }
    return style;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.addEventListener('filterChanged', this.onFilterChanged.bind(this));
    this.gridApi.sizeColumnsToFit();
  }

  onFilterChanged() {
    // Reset pagination to the first page
    this.gridApi.paginationGoToPage(0);

    // Optionally, reset any custom parameters related to pagination offset here
    // For instance, if you have a custom parameter for tracking offset, reset it
    this.pagination.PageOffset = 0;
    let allFilterModels = this.gridApi.getFilterModel();
    this.filtersActive = Object.keys(allFilterModels).length > 0;
    // Now, your fetchData method should handle the request with the reset PageOffset
  }


  /*getFeedbackList(){
    this.loader = true;
    this.pagination.PageOffset = 0;
    this.pagination.CurrentPage = 1;
    this.getFeebackDetailsEndpoint(this.filterParams, this.pagination, this.Shorting, false);
  }

  async getFeebackDetailsEndpoint(params:FeedbackFilters, pagination:PaginationParams, short:ShortParams, download:boolean){
    this.complaintTypeList = [];
    this.solutionsList = [];
    await this.feedbackService.getTickets(params, pagination, short, download).subscribe((data:any) => {
      data.map((d:any) => {

        d.expandData = false;

        if(d.json_data.fileUrls && !Array.isArray(d.json_data.fileUrls)){
          d.json_data.fileUrls = JSON.parse(d.json_data.fileUrls);
        }else{
          d.json_data.fileUrls = [];
        }
        d.modified_date = this.datePipe.transform(d.modified_date, 'shortDate');
        d.ticket_details.map((sub_d:any) => {
          if(sub_d.json_data.fileUrls && !Array.isArray(sub_d.json_data.fileUrls)){
            sub_d.json_data.fileUrls = JSON.parse(sub_d.json_data.fileUrls);
          }else{
            sub_d.json_data.fileUrls = [];
          }

          sub_d.json_data.SKUGroup.map((json:any) => {
            if (!Array.isArray(this.complaintTypeList[sub_d.id])) {
              this.complaintTypeList[sub_d.id] = [];
            }
            if (!Array.isArray(this.solutionsList[sub_d.id])) {
              this.solutionsList[sub_d.id] = [];
            }
            const complaintName = this.internalService.getNameFromComplaintList(json.Complaint);
            if (!this.complaintTypeList[sub_d.id].includes(complaintName)) {
              this.complaintTypeList[sub_d.id].push(complaintName);
            }
            const solutionName = this.internalService.getNameFromSolution(json.Solution);
            if (!this.solutionsList[sub_d.id].includes(solutionName)) {
              this.solutionsList[sub_d.id].push(solutionName);
            }
          });
          sub_d.modified_date = this.datePipe.transform(sub_d.modified_date, 'shortDate');
          if(this.internalService.feedbackUpdatePage && sub_d.id === this.internalService.feedbackFormId){
            sub_d.status = (this.internalService.feedbackformPayloadData.status == 1) ? 'Pending' : 'Solved';
          }
        });
      });

      this.ticketsList = this.tempTicketsList = data;
      this.pagination.TotalRecords = (this.ticketsList[0]?.order_count) ? this.ticketsList[0].order_count : 0;
      this.pagination.TotalPages = Math.ceil(this.pagination.TotalRecords / this.pagination.RecordsPerPage);
      this.loader = false;
      this.changeThePagination();
    });
  }


  changeThePagination(){
    // Calculate the range of pages to display
    this.pagination.PagesToDisplay = [];
    const maxPagesToShow = 3;
    if(this.pagination.CurrentPage == 1){// You can adjust this number as needed

      for (let i = this.pagination.CurrentPage - 1; i <= this.pagination.CurrentPage + 1; i++) {
        if (i >= 2 && i <= this.pagination.TotalPages - 1) {
          this.pagination.PagesToDisplay.push(i);
        }
      }

      if (this.pagination.PagesToDisplay.length < maxPagesToShow) {
        while (this.pagination.PagesToDisplay.length < maxPagesToShow && this.pagination.PagesToDisplay[0] > 2) {
          this.pagination.PagesToDisplay.unshift(this.pagination.PagesToDisplay[0] - 1);
        }

        while (this.pagination.PagesToDisplay.length < maxPagesToShow && this.pagination.PagesToDisplay[this.pagination.PagesToDisplay.length - 1] < this.pagination.TotalPages - 1) {
          this.pagination.PagesToDisplay.push(this.pagination.PagesToDisplay[this.pagination.PagesToDisplay.length - 1] + 1);
        }
      }
    }else{
       // You can adjust this number as needed
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      const startPage = Math.max(1, Math.min(this.pagination.CurrentPage - halfMaxPagesToShow, this.pagination.TotalPages - maxPagesToShow + 1));
      const endPage = Math.min(this.pagination.TotalPages, startPage + maxPagesToShow - 1);
      this.pagination.PagesToDisplay = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
  }

  onSort(column: string) {
    // Check if the same column header is clicked again
    this.loader = true;
    if (column === this.Shorting.ShortName) {
      // Toggle the sorting direction
      this.Shorting.IsAscending = !this.Shorting.IsAscending;
    } else {
      // If a new column is clicked, reset the sorting direction to ascending
      this.Shorting.IsAscending = true;
    }

    // Update the sortedColumn to the current column
    this.Shorting.ShortName = column;
    this.Shorting.ShortType = (this.Shorting.IsAscending) ? 'asc' : 'desc';
    // Sort the ticketsList based on the selected column and direction
    this.getFeedbackList();
  } */

  onEdit(ticket:any, id:number){
    this.router.navigate(['/FeedBackPage'], { queryParams: {'TrackeId': id } });
  }

  inactiveTicket(id:number, orderNumber:number){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    const removalData = {
      "id": id,
      "Modified_by": authUser.id,
      "is_active": false
    }
    const modalRefApprove = this.modalService.open(ConfirmationCheckComponent,{
      backdropClass: 'custom-backdrop'
    });
    const context:string = "Are you Sure! You want to Delete Order "+orderNumber;
    (<ConfirmationCheckComponent>modalRefApprove.componentInstance).data = context;
    modalRefApprove.componentInstance.OutputData.subscribe((data:any) => {
      this.ticketsList = this.ticketsList.filter((ticket:any) => {
        this.feedbackService.inactiveTicket(removalData).subscribe();
        ticket.ticket_details = ticket.ticket_details.filter((s_ticket:any) => s_ticket.id !== id);
        return ticket.latest_ticket_id !== id;
      });
      this.toaster.showSuccess('Success!', 'Order Removed Successfully.');
    });

  }

  /*pageChangeInfo(event:any){
    this.loader = true;
    this.pagination.CurrentPage=event.CurrentPage;
    this.pagination.PageOffset=event.PageOffset;
    this.pagination.RecordsPerPage=event.RecordsPerPage;
    this.internalService.paginationParamsExist = true;
    this.internalService.pagination = this.pagination;
    this.getFeebackDetailsEndpoint(this.filterParams, this.pagination, this.Shorting, false);
  } */


  //filterParams!:FeedbackFilters;
  /*async filterData(params:FeedbackFilters){
    this.loader = true;
    this.filterParams = params;
    this.pagination.PageOffset = 0;
    this.pagination.CurrentPage = 1;
    this.getFeebackDetailsEndpoint(this.filterParams, this.pagination, this.Shorting, false);
  } */


  exportData(type:string){
    this.feedbackService.getTickets(this.filterParams, this.pagination, this.Shorting, true).subscribe({
      next: (data:any) => {
        try {
          this.mapDataToReports(data, type);
        } catch (error) {
          console.error('JSON Parse Error:', error);
        }
      },
      error:(error)=>{
        console.error('JSON Parse Error: ', error.message);
      }
    });
  }

  mapDataToReports(data: any[], type: string){
    let datamap:any[] = [];
    let orderlevelIncrement = 0;
    data.map((d:any, index: any)=>{

      d.ticket_details.map((d_sub:any) => {
        orderlevelIncrement = orderlevelIncrement+1;
        let allComments: string = '';
        let commentCount = 0;
        if(!d_sub.comments){
          d_sub.comments = JSON.parse(d_sub.comments);
        }
        d_sub.comments?.map((comment:any) => {
          commentCount = commentCount+1;
          allComments += (commentCount)+'. '+comment.comment.replace(/\r?\n|\r/g, ' ')+'. ';
        });
        const skuArraySplit = (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.allSKUs : d_sub.json_data.SKU;
        let skulevelIncrement = 0;
        let skuIncrement = 0;
        skuArraySplit.split(',').forEach((sku:any) => {
          skulevelIncrement = skulevelIncrement+1;
          const dataPush = {
            "SL.": orderlevelIncrement,
            "SKU SL.": skulevelIncrement,
            Order: d_sub.json_data.orderId,
            "Order Level": (d_sub.json_data.SKU == 'FULL-ORDER') ? "FULL-ORDER" : "SKU",
            MIO: d_sub.json_data.MIO,
            Canada: d_sub.json_data.Country,
            "Complaint Type": (d_sub.json_data.SKU == 'FULL-ORDER') ? this.internalService.getNameFromComplaintList(d_sub.json_data.SKUGroup[0]?.Complaint) : this.internalService.getNameFromComplaintList(d_sub.json_data.SKUGroup[skuIncrement]?.Complaint),
            "Complaint": (d_sub.json_data.SKU == 'FULL-ORDER') ? this.internalService.getNameFromComplaintType(d_sub.json_data.SKUGroup[0]?.TypeOfComplaint) : this.internalService.getNameFromComplaintType(d_sub.json_data.SKUGroup[skuIncrement]?.TypeOfComplaint),
            "Solution": (d_sub.json_data.SKU == 'FULL-ORDER') ? this.internalService.getNameFromSolution(d_sub.json_data.SKUGroup[0]?.Solution) : this.internalService.getNameFromSolution(d_sub.json_data.SKUGroup[skuIncrement]?.Solution),
            "Stamp1": this.internalService.getNameFromStamp1(d_sub.json_data.Stamp1),
            //"Stamp2": this.internal.getNameFromStamp2(d_sub.json_data.Stamp2),
            "Quantity Max": this.getShopifySKUQuantity(d_sub.json_data.SKU, d_sub.json_data, skuIncrement, sku),
            Quantity: this.getShopifySKUChangedQuantity(d_sub.json_data.SKU, d_sub.json_data, skuIncrement, sku),
            "SKU": sku,
            "Order Created Date": (d_sub.json_data?.order_placed_at) ? this.datePipe.transform(d_sub.json_data.order_placed_at, 'customDateTime') : '',
            "Quantity Replaced": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.QtyReplaced : d_sub.json_data.SKUGroup[skuIncrement]?.QtyReplaced,
            "SKU Replaced": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.SKUReplaced : d_sub.json_data.SKUGroup[skuIncrement]?.SKUReplaced,
            "Shipping": this.internalService.getNameFromShipping(d_sub.json_data.Shipping),
            "Return": d_sub.json_data.Return,
            "Source": this.internalService.getNameFromSource(d_sub.json_data.Source),
            "Assignee": this.internalService.getNameFromAssignee(d_sub.json_data.Assg),
            "Created By": d_sub.created_by,
            "Created Date": this.datePipe.transform(d_sub.created_date, 'customDateTime'),
            "Modified By": d_sub.modified_by,
            "Modified Date": this.datePipe.transform(d_sub.modified_date, 'customDateTime'),
            "Status": d_sub.status,
            "Comments": allComments
          };
          skuIncrement = skuIncrement+1;
          datamap.push(dataPush);
        });
      });
    });
    const currentDate = this.datePipe.transform(new Date(), 'shortDate');
    const csvTitle = `${this.pageTitle}-${currentDate}.csv`;
    const XlsTitle = `${this.pageTitle}-${currentDate}.xlsx`;
    (type == 'CSV') ? this.dataExportService.exportToCSV(datamap, csvTitle) : this.dataExportService.exportToExcel(datamap, XlsTitle);
  }

  getShopifySKUQuantity(skuType:any, json_data:any, increment:number, SKU:string){
    let skuQuntityMax = 0;

    if(skuType == 'FULL-ORDER'){
      skuQuntityMax = json_data.SKUGroup[0]?.skuQuantityTemp;
    }else{
      skuQuntityMax = json_data.SKUGroup[increment]?.skuQuantityTemp;
    }
    if(skuQuntityMax == 0){
      if(json_data.skuQuantityMap){
        json_data.skuQuantityMap.filter((quantityMap:any) => {
          if(quantityMap.sku == SKU) {
            skuQuntityMax = quantityMap.skuQuantity;
          }
        });
      }
    }
    return skuQuntityMax;
  }

  getShopifySKUChangedQuantity(skuType:any, json_data:any, increment:number, SKU:string){
    let skuQuntity = 0;

    if((skuType === 'FULL-ORDER' && !json_data.MIO) || (skuType !== 'FULL-ORDER')){
      skuQuntity = (json_data.SKU == 'FULL-ORDER') ? json_data.SKUGroup[0]?.skuQuantity : json_data.SKUGroup[increment]?.skuQuantity

    }else{
      if(json_data.SKU == 'FULL-ORDER'){
        if(json_data.skuQuantityMap){
          json_data.skuQuantityMap.filter((quantityMap:any) => {
            if(quantityMap.sku == SKU) {
              skuQuntity = quantityMap.skuQuantity;
            }
          });
        }
      }

    }

    return skuQuntity;
  }

  navigateToNewForm(){
    this.router.navigate(['/FeedBackPage'], { queryParams: {'Tracker': 'NewTracker' } });
  }

}

@Component({
  selector: 'view-cell-renderer',
  template: `<span (click)="onEdit(params.data, params.data.latest_ticket_id)" class="handCursor"><i class="fas fa-eye"></i></span>`
})
export class ViewCellRendererComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onEdit(data:any, id:number) {
    // Edit logic here
  }
}


@Component({
  selector: 'expand-cell-renderer',
  template: `<img class="btn dropdownIcon" (click)="toggleGroupOrders()" src="assets/dist/img/icons/down-arrow.png">`
})
export class ExpandCellRendererComponent {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  toggleGroupOrders() {
    this.params.context.componentParent.toggleGroupOrders(this.params.rowIndex);
  }
}

