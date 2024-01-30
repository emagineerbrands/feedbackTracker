import { Component, OnInit } from '@angular/core';
import { FeedbackFilters } from '../../../interface/FeedbackFilters';
import { PaginationParams } from '../../../interface/PaginationParams';
import { ShortParams } from '../../../interface/ShortParams';
import { User } from '../../../interface/User';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { DatePipe } from '@angular/common';
import { InternalService } from '../../../services/internal-service/internal.service';
import { Router } from '@angular/router';
import { DataExportService } from '../../../services/data-export-service/data-export.service';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationCheckComponent } from '../../model-popup/confirmation-check/confirmation-check.component';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.css'
})
export class FeedbackListComponent implements OnInit{

  userDetails:User;

  filterParams:FeedbackFilters = {
    OrderNumber:'',
    Agent:0,
    DateRange:{FromDate:'', ToDate:''},
    Complaint:'',
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

  pageTitle:string = 'Order Issue Tracker';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'feedback_tracker', 'status':'active'},
  ];

  ticketsList:any[] = [];
  tempTicketsList:any[] = [];
  loader:boolean = false;
  complaintTypeList:any[]=[];

  constructor(
    private service: FeedbackService,
    private datePipe: DatePipe,
    public internal:InternalService,
    private router: Router,
    private dataExportService: DataExportService,
    private modalService: NgbModal
  ){
    this.userDetails = JSON.parse(localStorage.getItem('authDetails') || 'null');
  }

  ngOnInit(): void {
    this.getFeedbackList();
  }


  getFeedbackList(){
    this.loader = true;
    this.pagination.PageOffset = 0;
    this.pagination.CurrentPage = 1;
    this.getFeebackDetailsEndpoint(this.filterParams, this.pagination, this.Shorting, false);
  }

  async getFeebackDetailsEndpoint(params:FeedbackFilters, pagination:PaginationParams, short:ShortParams, download:boolean){
    this.complaintTypeList = [];
    await this.service.getTickets(params, pagination, short, download).subscribe((data:any) => {
      data.map((d:any) => {
        d.expandData = false;
        if(Array.isArray(d.json_data.fileUrls) && d.json_data.fileUrls?.length > 0){
          d.json_data.fileUrls = JSON.parse(d.json_data.fileUrls);
        }
        d.modified_date = this.datePipe.transform(d.modified_date, 'MM-dd-yyyy');
        d.ticket_details.map((sub_d:any) => {
          if(Array.isArray(sub_d.json_data.fileUrls) && sub_d.json_data.fileUrls?.length > 0){
            sub_d.json_data.fileUrls = JSON.parse(sub_d.json_data.fileUrls);
          }

          sub_d.json_data.SKUGroup.map((json:any) => {
            if (!Array.isArray(this.complaintTypeList[sub_d.id])) {
              this.complaintTypeList[sub_d.id] = [];
            }
            if (!this.complaintTypeList[sub_d.id].includes(json.Complaint)) {
              this.complaintTypeList[sub_d.id].push(json.Complaint);
            }
          });
          sub_d.modified_date = this.datePipe.transform(sub_d.modified_date, 'MM-dd-yyyy');
          if(this.internal.feedbackUpdatePage && sub_d.id === this.internal.feedbackFormId){
            sub_d.status = (this.internal.feedbackformPayloadData.status == 1) ? 'Pending' : 'Solved';
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
  }

  toggleGroupOrders(index:number){
    this.ticketsList[index].expandData = !this.ticketsList[index].expandData;
  }

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
        this.service.inactiveTicket(removalData).subscribe();
        ticket.ticket_details = ticket.ticket_details.filter((s_ticket:any) => s_ticket.id !== id);
        return ticket.latest_ticket_id !== id;
      });
    });

  }

  pageChangeInfo(event:any){
    this.loader = true;
    this.pagination.CurrentPage=event.CurrentPage;
    this.pagination.PageOffset=event.PageOffset;
    this.pagination.RecordsPerPage=event.RecordsPerPage;
    this.getFeebackDetailsEndpoint(this.filterParams, this.pagination, this.Shorting, false);
  }


  //filterParams!:FeedbackFilters;
  async filterData(params:FeedbackFilters){
    this.loader = true;
    this.filterParams = params;
    this.pagination.PageOffset = 0;
    this.pagination.CurrentPage = 1;
    this.getFeebackDetailsEndpoint(this.filterParams, this.pagination, this.Shorting, false);
  }


  exportData(type:string){
    let datamap:any[] = [];
    this.service.getTickets(this.filterParams, this.pagination, this.Shorting, true).subscribe((data:any) =>{
      let orderlevelIncrement = 0;
      data.map((d:any)=>{
        d.ticket_details.map((d_sub:any) => {
          orderlevelIncrement = orderlevelIncrement+1;
          let allComments: string = '';
          let commentCount = 0;

          d_sub.comments?.map((comment:any) => {
            commentCount = commentCount+1;
            allComments += (commentCount)+'. '+comment.comment.replace(/\n/g, ' ')+'; ';
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
              "Complaint Type": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.Complaint : d_sub.json_data.SKUGroup[skuIncrement]?.Complaint,
              "Complaint": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.TypeOfComplaint : d_sub.json_data.SKUGroup[skuIncrement]?.TypeOfComplaint,
              "Solution": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.Solution : d_sub.json_data.SKUGroup[skuIncrement]?.Solution,
              "Stamp1": d_sub.json_data.Stamp1,
              "Stamp2": d_sub.json_data.Stamp2,
              "Quantity Max": this.getShopifySKUQuantity(d_sub.json_data.SKU, d_sub.json_data, skuIncrement, sku),
              Quantity: this.getShopifySKUChangedQuantity(d_sub.json_data.SKU, d_sub.json_data, skuIncrement, sku),
              "SKU": sku,
              "Quantity Replaced": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.QtyReplaced : d_sub.json_data.SKUGroup[skuIncrement]?.QtyReplaced,
              "SKU Replaced": (d_sub.json_data.SKU == 'FULL-ORDER') ? d_sub.json_data.SKUGroup[0]?.SKUReplaced : d_sub.json_data.SKUGroup[skuIncrement]?.SKUReplaced,
              "Shipping": d_sub.json_data.Shipping,
              "Return": d_sub.json_data.Return,
              "Source": d_sub.json_data.Source,
              "Assignee": d_sub.json_data.Assg,
              "Created By": d_sub.created_by,
              "Created Date": this.datePipe.transform(d_sub.created_date, 'MM-dd-yyyy h:mm:ss a'),
              "Modified By": d_sub.modified_by,
              "Modified Date": this.datePipe.transform(d_sub.modified_date, 'MM-dd-yyyy h:mm:ss a'),
              "Status": d_sub.status,
              "Comments": allComments
            };
            skuIncrement = skuIncrement+1;
            datamap.push(dataPush);

          });

        });

      });
      const currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
      const csvTitle = 'Order-Issue-Tracker-'+currentDate+'.csv';
      const XlsTitle = 'Order-Issue-Tracker-'+currentDate+'.xlsx';
      (type == 'CSV') ? this.dataExportService.exportToCSV(datamap, csvTitle) : this.dataExportService.exportToExcel(datamap, XlsTitle);
    });
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

}
