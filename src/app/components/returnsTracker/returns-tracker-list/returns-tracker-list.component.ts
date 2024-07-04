import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { InternalService } from 'src/app/services/internal.service';
import { stringify } from '@firebase/util';
import { ReturnsList } from '../../../models/returnsList.interface';
import { ReturnsService } from '../../../services/returns-service/returns.service';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { DataExportService } from '../../../services/data-export-service/data-export.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { RemoveTicketConfirmComponent } from '../../model-popup/remove-ticket-confirm/remove-ticket-confirm.component';
import { ShortDatePipe } from '../../../customPipes/short-date.pipe';
import { DateConvertService } from '../../../services/date-convert-service/date-convert.service';

@Component({
  selector: 'app-returns-tracker-list',
  templateUrl: './returns-tracker-list.component.html',
  styleUrls: ['./returns-tracker-list.component.css']
})
export class ReturnsTrackerListComponent {

  pageTitle:string = 'Returns Tracker Details';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'returns', 'status':'active'},
  ];

  // filters
  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;
  fromDateSearch:string = '';
  toDateSearch:string = '';

  usersList:any = [];
  userDetails:any;

  statusOptions = [{
    id:1,
    name:"Pending"
  },{
    id:3,
    name:"Solved"
  }];

  searchResultsLoader = false;
  ticketsList:any[]=[];
  temporaryTickets:any[]=[];


  returns:ReturnsList = {
    recordsPerPage:10,
    totalRecords:0,
    pageOffset:0,
    currentPage:1,
    totalPages:0,
    pagesToDisplay:[],
    order_id:'',
    store_name:'',
    order_number:'',
    start_date:'',
    end_date:'',
    status:0,
    total_returned_quantity:0,
    total_damaged_quantity:0,
    modifiedBy:0,
    sort_name:'id',
    sort_type:'desc',
    isAscending:false,
    download:false
  }

  constructor(
    private returnsService:ReturnsService,
    private router: Router,
    private datePipe: DateConvertService,
    private feedbackService: FeedbackService,
    private formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    public internalService:InternalService,
    private dataExportService: DataExportService,
  ){
    this.getTicketsEndpoint(this.returns);
    this.getALlUsers();
    this.userDetails = JSON.parse(localStorage.getItem('authDetails') || 'null');
  }

  navigateUrl(page:string){
    this.router.navigate([page]);
  }

  navigateUrlToBlank(){
    this.router.navigate(['/shipping_tracker'], { queryParams: {'orderNumber': 'NewOrder' } });
  }

  async getALlUsers(){
    await this.feedbackService.allUsersList().subscribe((data:any) =>{
      this.usersList = data;
    });
  }

  navigateHomePgae(){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    if(authUser.role_id.includes(4)){
      this.router.navigate(['/returns']);
    }else{
      this.router.navigate(['/order-issues-tracker']);
    }
  }

  async getTicketsEndpoint(returns:any){
    this.searchResultsLoader = true;
    await this.returnsService.getReturnsDetails(returns).subscribe((data:any) =>{
      data.map((d:any) => {
        if(this.internalService.returnsDetails && this.internalService.returnsDetails.id == d.latest_ticket_id){
          d.status = (this.internalService.returnsDetails.status == "3") ? "Solved":"Pending";
          d.json_data = this.internalService.returnsDetails.json_data;
          this.internalService.returnsDetails = null;
        }
        d.expandData = false;
        if(d.json_data.fileUrls && !Array.isArray(d.json_data.fileUrls)){
          d.json_data.fileUrls = JSON.parse(d.json_data.fileUrls);
        }
        d.quantityReturnedInTotal = d.quantityReturnedInTotal ?? 0;
        d.quantityDamagedInTotal = d.quantityDamagedInTotal ?? 0;
        d.modified_date = this.datePipe.transform(d.modified_date, 'shortDate');


        d.ticket_details.map((sub_d:any) => {
          if(sub_d.json_data.fileUrls && !Array.isArray(sub_d.json_data.fileUrls)){
            sub_d.json_data.fileUrls = JSON.parse(sub_d.json_data.fileUrls);
          }
          sub_d.quantityReturnedInTotal = d.quantityReturnedInTotal ?? 0;
          sub_d.quantityDamagedInTotal = d.quantityDamagedInTotal ?? 0;
          sub_d.modified_date = this.datePipe.transform(sub_d.modified_date, 'shortDate');
        });
      });
      if(this.internalService.returnsDetails && this.internalService.returnsDetails.id == '0'){
        data.unshift(this.updateDataAfterSubmit(stringify(parseInt(data[0].latest_ticket_id) + 1), parseInt(data[0].order_count)+1));
        this.internalService.returnsDetails = null;
      }
      this.ticketsList = this.temporaryTickets = data;
      this.returns.totalRecords = (this.ticketsList[0]?.order_count) ? this.ticketsList[0].order_count : 0;
      this.returns.totalPages = Math.ceil(this.returns.totalRecords / this.returns.recordsPerPage);
      this.searchResultsLoader = false;
      this.changeThePagination();
    });
  }


  toggleGroupOrders(index:number){
    this.ticketsList[index].expandData = !this.ticketsList[index].expandData;
  }

  onPageChange(page:number){

    if (page >= 1 && page <= this.returns.totalPages) {
      this.returns.currentPage = page;
      this.returns.pageOffset = (this.returns.currentPage*this.returns.recordsPerPage  - this.returns.recordsPerPage );
      this.returns.download = false;
      this.getTicketsEndpoint(this.returns);

    }
  }

  changeThePagination(){
    // Calculate the range of pages to display
    this.returns.pagesToDisplay = [];
    const maxPagesToShow = 3;
    if(this.returns.currentPage == 1){// You can adjust this number as needed

      for (let i = this.returns.currentPage - 1; i <= this.returns.currentPage + 1; i++) {
        if (i >= 2 && i <= this.returns.totalPages - 1) {
          this.returns.pagesToDisplay.push(i);
        }
      }

      if (this.returns.pagesToDisplay.length < maxPagesToShow) {
        while (this.returns.pagesToDisplay.length < maxPagesToShow && this.returns.pagesToDisplay[0] > 2) {
          this.returns.pagesToDisplay.unshift(this.returns.pagesToDisplay[0] - 1);
        }

        while (this.returns.pagesToDisplay.length < maxPagesToShow && this.returns.pagesToDisplay[this.returns.pagesToDisplay.length - 1] < this.returns.totalPages - 1) {
          this.returns.pagesToDisplay.push(this.returns.pagesToDisplay[this.returns.pagesToDisplay.length - 1] + 1);
        }
      }
    }else{
       // You can adjust this number as needed
      const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
      const startPage = Math.max(1, Math.min(this.returns.currentPage - halfMaxPagesToShow, this.returns.totalPages - maxPagesToShow + 1));
      const endPage = Math.min(this.returns.totalPages, startPage + maxPagesToShow - 1);
      this.returns.pagesToDisplay = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    }

  }

  onEdit(id:number){
    this.internalService.editStatus = true;
    this.router.navigate(['/shipping_tracker'], { queryParams: {'TrackeId': id } });
  }

  onDateRangeChange() {
    if (this.fromDate && this.toDate) {
      this.returns.start_date = this.formatter.format(this.fromDate);
      this.returns.end_date = this.formatter.format(this.toDate);
      this.returns.pageOffset = 0;
      this.returns.currentPage = 1;
      this.returns.download = false;
      this.getTicketsEndpoint(this.returns);
    }
  }

  checkParamsSearch(){
    return (this.returns.store_name != '' || this.returns.order_number != '' || (this.returns.start_date != "" && this.returns.end_date != '') || this.returns.status != 0 || this.returns.modifiedBy != 0);
  }

  clearAll(){
    this.returns = {
      recordsPerPage:10,
      totalRecords:0,
      pageOffset:0,
      currentPage:1,
      totalPages:0,
      pagesToDisplay:[],
      order_id:'',
      order_number:'',
      store_name:'',
      start_date:'',
      end_date:'',
      status:0,
      total_returned_quantity:0,
      total_damaged_quantity:0,
      modifiedBy:0,
      sort_name:'id',
      sort_type:'desc',
      isAscending:false,
      download:false
    };
    this.getTicketsEndpoint(this.returns);
  }

  filterTickets(){
    this.returns.pageOffset = 0;
    this.returns.currentPage = 1;
    this.returns.download = false;
    this.getTicketsEndpoint(this.returns);
  }

  onSort(column:string){
    if (column === this.returns.sort_name) {
      // Toggle the sorting direction
      this.returns.isAscending = !this.returns.isAscending;
    } else {
      // If a new column is clicked, reset the sorting direction to ascending
      this.returns.isAscending = true;
    }
    this.returns.sort_name = column;
    this.returns.sort_type = (this.returns.isAscending) ? 'asc' : 'desc';
    this.returns.pageOffset = 0;
    this.returns.currentPage = 1;
    this.returns.download = false;
    this.getTicketsEndpoint(this.returns);
  }

  deleteTicket(orderId:number, orderNumber:string){

    const modalRefApprove = this.modalService.open(RemoveTicketConfirmComponent);
    (<RemoveTicketConfirmComponent>modalRefApprove.componentInstance).order = orderNumber;
    (<RemoveTicketConfirmComponent>modalRefApprove.componentInstance).orderId = orderId;
    (<RemoveTicketConfirmComponent>modalRefApprove.componentInstance).tracker_type = 'RETURNS-TRACKER';
    modalRefApprove.componentInstance.ReturnsData.subscribe((data:any) => {
      this.ticketsList = this.ticketsList.filter((ticket:any) => {
        ticket.ticket_details = ticket.ticket_details.filter((s_ticket:any) => s_ticket.id !== orderId);
        return ticket.latest_ticket_id !== orderId;
      });
    });

  }

  filterTicketByOrderId(event:any){
    const inputChar = String.fromCharCode(event.charCode);
    // Use a regular expression to test if the input character is a digit
    if (!/^\d+$/.test(inputChar)) {
      // If not a digit, prevent the input
      event.preventDefault();
    }
  }

  getfilterByOrder(event:any){
    alert(event.target.value);
  }

  getCurrentDate(){
    const date = new Date();
    const shortDate = this.datePipe.transform(date, 'shortDate');
    return shortDate || ''; // Handle null or undefined result
  }

  updateDataAfterSubmit(id:string, order_count:number){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
      const last_insertData = {
        "order_number":this.internalService.returnsDetails.json_data.orderNumber,
        "latest_ticket_id":id,
        "ticket_details":[
          {
            "id":id,
            "json_data":this.internalService.returnsDetails.json_data,
            "created_by":authUser.name,
            "created_date":this.getCurrentDate(),
            "modified_by":authUser.name,
            "modified_date":this.getCurrentDate(),
            "status":(this.internalService.returnsDetails.status == "3")?'Solved':'Pending',
            "comments":[],
          }
        ],
        "order_count":order_count,
        "json_data":this.internalService.returnsDetails.json_data,
        "created_by":authUser.name,
        "created_date":this.getCurrentDate(),
        "modified_by":authUser.name,
        "modified_date":this.getCurrentDate(),
        "status":(this.internalService.returnsDetails.status == "3") ? "Solved":"Pending",
        "comments":[],
      }
      return last_insertData;

  }

  exportData(type:string){
    let datamap:any[] = [];
    this.returns.download = true;
    this.returnsService.getReturnsDetails(this.returns).subscribe((data:any) =>{
      let orderlevelIncrement = 0;
      data.map((d:any)=>{
        d.ticket_details.map((d_sub:any) => {
          orderlevelIncrement = orderlevelIncrement+1;
          let allComments: string = '';
          let commentCount = 0;
          d_sub.comments?.map((comment:any) => {
            commentCount = commentCount+1;
            allComments += (commentCount)+'. '+comment.comment.replace(/\r?\n|\r/g, ' ')+'. ';
          });
          let skulevelIncrement = 0;
          let skuIncrement = 0;
          d_sub.json_data.skuGroup.forEach((sku:any) => {
            skulevelIncrement = skulevelIncrement+1;
            const dataPush = {
              "SL.": orderlevelIncrement,
              "SKU SL.": skulevelIncrement,
              "Order Number": d_sub.json_data.orderNumber,
              "Store Name": d_sub.json_data.storeName,
              "Order Date": this.datePipe.transform(d_sub.json_data.orderDate, 'customDateTime'),
              MIO: d_sub.json_data.MIO,
              Canada: d_sub.json_data.country,
              "Out-Side Shipstation": d_sub.json_data.outSideShipStation,
              "SKU": sku.sku,
              "Quantity Returned": sku.qtyReturned,
              "Damaged Quantity": sku.qtyDamaged,
              "Created By": d_sub.created_by,
              "Created Date": this.datePipe.transform(d_sub.created_date, 'customDateTime'),
              "Modified By": d_sub.modified_by,
              "Modified Date": this.datePipe.transform(d_sub.modified_date, 'customDateTime'),
              "Status": d_sub.status,
              "Comments": allComments
            }
            skuIncrement = skuIncrement+1;
            datamap.push(dataPush);
          });
        });
      });

      const currentDate = this.datePipe.transform(new Date(), 'shortDate');
      const csvTitle = `${this.pageTitle}-${currentDate}.csv`;
      const XlsTitle = `${this.pageTitle}-${currentDate}.xlsx`;
      (type == 'CSV') ? this.dataExportService.exportToCSV(datamap, csvTitle) : this.dataExportService.exportToExcel(datamap, XlsTitle);

    });
  }

}
