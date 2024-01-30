import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DateRange } from '../../../interface/DateRange';
import { FeedbackFilters } from '../../../interface/FeedbackFilters';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { firstValueFrom } from 'rxjs';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-feedback-filters',
  templateUrl: './feedback-filters.component.html',
  styleUrl: './feedback-filters.component.css'
})
export class FeedbackFiltersComponent implements OnInit{

  filters:FeedbackFilters = {OrderNumber:'', Agent:0, DateRange:{FromDate:'', ToDate:''}, Complaint:'', Assignee:'', Status:0 };

  complaintsList:any[] = [];
  assignee:any[] = [];
  ticketStatus:any[] = [];
  usersList:any[] = [];

  fromDate!: NgbDateStruct | null;
  toDate!: NgbDateStruct | null;

  @Output() filterOptions = new EventEmitter<any>();

  constructor(
    private router: Router,
    private service: FeedbackService,
    public internalService: InternalService,
    private formatter: NgbDateParserFormatter
  ) {}

  ngOnInit(): void {
    this.getDropdownData();
    this.getALlUsers();
  }

  dateRangePicker(event:any){
    this.filters.DateRange={FromDate:this.formatter.format(event.fromDate),ToDate:this.formatter.format(event.toDate) }
    this.fromDate=event.fromDate;
    this.toDate=event.toDate;
    this.filterOptions.emit(this.filters);
  }

  async getDropdownData() {
    if (!this.internalService.dropdownDataExist) {
      try {
        const dataStatic = await firstValueFrom(this.service.getAllStaticData());
        this.processDropdownData(dataStatic);
        this.internalService.dropdownDataExist = true;
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        // Handle error appropriately
      }
    } else {
      this.loadDropdownDataFromService();
    }
  }

  processDropdownData(dataStatic: any) {
    // Process and assign the data here
    this.internalService.dropdownData = {
      StampOne: dataStatic.stampOneLookUp,
      StampTwo: dataStatic.stampTwoLookUp,
      Solutions: dataStatic.solutions,
      Shipping: dataStatic.shipping,
      Source: dataStatic.source,
      Assignee: dataStatic.assigned,
      TicketStatus: dataStatic.logType,
      Complaint: dataStatic.complaint,
      ComplaintType: this.getComplaintTypes(dataStatic.complaint)
    };

    // Assign values for local use
    this.assignee = this.internalService.dropdownData.Assignee;
    this.ticketStatus = this.internalService.dropdownData.TicketStatus;
    this.complaintsList = this.internalService.dropdownData.Complaint;
  }

  getComplaintTypes(complaints: any[]) {
    return complaints.flatMap(c => c.complaint_type.map((ct:any) => ({
      complaint_id: c.complaint_id,
      complaint_name: c.complaint_name,
      complaintType: ct
    })));
  }

  loadDropdownDataFromService() {
    this.complaintsList = this.internalService.dropdownData.Complaint;
    this.assignee = this.internalService.dropdownData.Assignee;
    this.ticketStatus = this.internalService.dropdownData.TicketStatus;
  }

  async getALlUsers(){
    await this.service.allUsersList().subscribe((data:any) =>{
      this.usersList = data;
    });
  }

  shouldShowClearButton() {
    return this.checkParamsSearch();
  }

  checkParamsSearch() {
    const hasOrderNumber = this.filters.OrderNumber.trim() !== '';
    const hasOrderStatus = this.filters.Status !== 0;
    const hasDateRange = this.filters.DateRange.FromDate !== '' && this.filters.DateRange.ToDate !== '';
    const hasComplaint = this.filters.Complaint.trim() !== '';
    const hasAgent = this.filters.Agent !== 0;

    return hasOrderNumber || hasOrderStatus || hasDateRange || hasComplaint || hasAgent;
  }

  clearAll() {
    this.filters.OrderNumber = '';
    this.filters.DateRange.FromDate = '';
    this.filters.DateRange.ToDate = '';
    this.filters.Status = 0;
    this.filters.Agent = 0;
    this.filters.Complaint = '';
    this.fromDate = null;
    this.toDate = null;
    this.filterOptions.emit(this.filters);
  }

  filterData(){
    this.filterOptions.emit(this.filters);
  }

}
