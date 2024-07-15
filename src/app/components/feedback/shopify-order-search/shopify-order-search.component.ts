import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject, debounceTime, takeUntil, filter } from 'rxjs';
import { FilteringSKUsModule } from '../../../enum/FilteringSKUsModule.enum';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { OrderIssueTrackerOrderSearch } from '../../../interface/OrderIssueTrackerOrderSearch';
import { ConfirmationCheckComponent } from '../../model-popup/confirmation-check/confirmation-check.component';

@Component({
  selector: 'app-shopify-order-search',
  templateUrl: './shopify-order-search.component.html',
  styleUrl: './shopify-order-search.component.css'
})
export class ShopifyOrderSearchComponent implements OnInit, OnDestroy{

  //BreadCrum Data
  pageTitle:string = 'Order Search';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': 'Order Issue Tracker', 'link': 'order-issues-tracker', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'orders_search', 'status':'active'},
  ];

  searchLoader:boolean = false;
  customerSearchLoader:boolean = false;
  orderSearchLoader:boolean = false;
  private filteringSKUsModule = FilteringSKUsModule;

  searchParams:OrderIssueTrackerOrderSearch={
    SearchType:'',
    SearchValue:'',
    OrdersType:'desc',
    PageRecords:10,
    OrdersCount:0,
    OrdersExist:false,
    Orders:[],
    PreviousURL:'',
    NextURL:'',
    CurrentPage:'',
    CustomersExist:false,
    Customers:[],
    selectedRowIndex:-1,
    isSortEnable : false,
    DataSearched: false
  }

  ordersList:any[] = [];
  customerDetails:any[] = [];
  isSortEnable:boolean = false;
  nextPageInfo:string | null = '';
  previousPageInfo:string | null = '';
  selectedRowIndex: number = -1;
  customerID:number=0;

  ignoreQueryParamChange:boolean = false;

  errorMessage: string = '';

  private queryParamsSubscription: Subscription | undefined;
  private searchInput = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    public internalService:InternalService,
    public feedbackService:FeedbackService,
    public router:Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ){}

  ngOnInit(): void {
    this.subscribeToQueryParams();
    this.searchInput.pipe(
      debounceTime(300), // Apply debouncing
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.getShopifyData({ searchType: this.searchParams.SearchType, searchValue: value });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  private subscribeToQueryParams(): void {
    this.queryParamsSubscription = this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$),
      filter(() => !this.ignoreQueryParamChange)
    ).subscribe(params => {
      this.getShopifyData(params);
    });
  }

  getUrlData(params: any) {
    if (!this.internalService.shopifyOrderSeachParams.PreviousDataExist) {
      this.handleQueryParams(params);
    }else{

      this.orderSearchLoader = true;
      this.assignValuesFromGetOrders(this.internalService.shopifyOrderSeachParams);
      this.getOrdersCount(this.searchParams.SearchValue);
    }
  }

  handleQueryParams(params: any) {
    const {
      ordersCount,
      rowsCount,
      shortBY,
      searchType,
      searchValue,
      current
    } = params;

    this.internalService.shopifyOrderSeachParams.OrdersCount = this.searchParams.OrdersCount = ordersCount || this.searchParams.OrdersCount;
    this.searchParams.PageRecords = rowsCount || this.searchParams.PageRecords;
    this.searchParams.OrdersType = shortBY || 'desc';

    if (searchType == 'phone') {
      this.orderSearchLoader = true;
      this.getCutomerDetails(searchValue);
      this.ordersList = [];
      this.searchParams.OrdersCount = 0;
    }
    if (searchType && searchValue) {

      this.searchParams.SearchType = this.internalService.shopifyOrderSeachParams.SearchType = searchType;
      this.searchParams.SearchValue = this.internalService.shopifyOrderSeachParams.SearchValue = searchValue;

      if (current === '' || !current) {
        this.customerDetails = [];
        this.getOrders(this.searchParams);
        this.getOrdersCount(this.searchParams.SearchValue);
      } else {

        this.searchBasedonPagination(current);
      }
    }
  }

  getShopifyData(event: any){
    this.searchParams.SearchType = event.searchType;
    this.searchParams.SearchValue = event.searchValue;
    if (!event.searchValue) {
      return;
    }
    if (event.searchType === "phone") {
      this.getCutomerDetails(this.searchParams.SearchValue);
    } else if (["email", "order"].includes(event.searchType)) {
        this.getOrders(this.searchParams);
        if(event.searchType === "email"){
          this.getOrdersCount(this.searchParams.SearchValue);
        }
    }
  }

  async getOrders(params:any){
    this.clearOrderDetails();
    this.searchParams.DataSearched = false;
    this.ignoreQueryParamChange = this.orderSearchLoader = true;
    await this.feedbackService.getOrdersNew(params)
    .subscribe({
      next:(response:any) => {
        this.orderSearchLoader = false;
        this.searchParams.DataSearched = true;
        if (response && Array.isArray(response.orders)) {
          if (response.orders.length > 0) {
            this.assignValuesFromGetOrders(response);
          }
        } else {
          this.errorMessage = 'Unexpected response format.';
          this.searchParams.OrdersExist = false;
          this.checkOrderForEmptyForm();
        }
      },
      error: (error) => {
        this.orderSearchLoader = false;
        this.errorMessage = error.message;
      }
    });
  }

  checkOrderForEmptyForm(){
    const modalRefApprove = this.modalService.open(ConfirmationCheckComponent,{
      backdropClass: 'custom-backdrop'
    });
    const context:string = "No Orders are found..!, Click Yes to create New Form";
    (<ConfirmationCheckComponent>modalRefApprove.componentInstance).data = context;
    modalRefApprove.componentInstance.OutputData.subscribe((data:any) => {
      this.router.navigate(['/FeedBackPage'], { queryParams: {'Tracker': 'NewTracker' } });
    });
  }

  async searchBasedonPagination(pageInfo: any){
    //console.log("PageInfo", pageInfo);
    if(pageInfo == ''){
      return;
    }
    this.orderSearchLoader = true;
    this.searchParams.CurrentPage = pageInfo;
    await this.feedbackService.getOrdersByPagination(pageInfo, this.searchParams.PageRecords)
    .subscribe({
      next: (response:any) => {
        this.orderSearchLoader = false;
        if (response && Array.isArray(response.orders)) {
          this.errorMessage = response.orders.length === 0 ? 'No records found.' : '';
          if (response.orders.length > 0) {
            this.assignValuesFromGetOrders(response);
          }
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (error) => {
        this.orderSearchLoader = false;
        console.log(error);
      }
    });
  }

  getCutomerDetails(phone:string){
    //this.ordersList = [];
    this.clearOrderDetails();
    this.ignoreQueryParamChange = this.orderSearchLoader = true;
    this.searchParams.DataSearched = false;
    this.feedbackService.getCustomerDetailsByPhone(phone)
    .subscribe({
      next: (response:any) => {
        this.orderSearchLoader = false;
        this.searchParams.DataSearched = true;
        if (response && Array.isArray(response)) {
          this.errorMessage = response.length === 0 ? 'No records found.' : '';
          if (response.length > 0) {
            this.searchParams.CustomersExist = true;
            this.searchParams.Customers = response;
            this.assignValuesToQueryParams(this.searchParams);
          }
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (error) => {

      }
    });
  }

  clearOrderDetails(){
    this.searchParams.Orders = [];
    this.searchParams.OrdersCount = 0;
    this.searchParams.Customers = [];
    this.searchParams.PageRecords = 10;
    this.orderSearchLoader = true;
    this.searchParams.OrdersExist = false;
    this.searchParams.CustomersExist = false;

    this.searchParams.NextURL = '';
    this.searchParams.PreviousURL = '';
    this.searchParams.CurrentPage = '';
  }

  assignValuesFromGetOrders(data:any){
    data.orders = this.internalService.returnFilterdOrders(data.orders, this.filteringSKUsModule.FeedbackTracker);
    this.searchParams.OrdersExist = true;
    this.searchParams.Orders = data.orders = this.searchParams.SearchType === "order" ? data.orders.filter((order:any) => order.order_number == this.searchParams.SearchValue.trim()) : data.orders;
    this.isSortEnable = (data.orders.length > 2);

    if(data.nextLink !== "" && data.nextLink){
      let nexturl = new URL(data.nextLink);
      this.searchParams.NextURL = nexturl.searchParams.get('page_info') ?? '';
    }else{
      this.searchParams.NextURL = '';
    }
    if(data.previousLink !== "" && data.previousLink){
      let previousurl = new URL(data.previousLink);
      this.searchParams.PreviousURL = previousurl.searchParams.get('page_info') ?? '';
    }else{
      this.searchParams.PreviousURL = '';
    }
    if(this.searchParams.SearchType === "order"){
      this.searchParams.OrdersCount = 1;
    }
    //this.searchParams.OrdersCount = 1;
    this.assignValuesToQueryParams(this.searchParams);
  }

  assignCustomerInfo(data:any){
    this.searchParams.Orders = data;
    this.isSortEnable = (data.length > 2);
    this.searchParams.NextURL = '';
    this.searchParams.PreviousURL = '';
    this.searchParams.OrdersExist = true;
    this.searchParams.OrdersCount = data.length;
    this.assignValuesToQueryParams(this.searchParams);
  }

  assignValuesToQueryParams(params:any){
    const queryParams = {
      'searchType': params.SearchType,
      'searchValue': params.SearchValue,
      'prev': params.PreviousURL,
      'next': params.NextURL,
      'current': params.CurrentPage,
      'ordersCount': params.OrdersCount,
      'rowsCount':params.PageRecords,
      'shortBY':params.OrdersType
    };
    this.navigateAndAssignURL(queryParams);
  }

  navigateAndAssignURL(queryParams: { searchType: any; searchValue: any; prev: any; next: any; current: any; ordersCount: any; rowsCount: any; shortBY: any; }) {
    // Create the URL string with query parameters
    this.internalService.shopifyOrderSeachParams.redirectPageUrl = this.router.createUrlTree(['/orders_search'], { queryParams }).toString();
    // Navigate to the URL
    this.router.navigateByUrl(this.internalService.shopifyOrderSeachParams.redirectPageUrl);
  }

  async getOrdersCount(params:string){
    this.searchParams.OrdersCount = 0;
    await this.feedbackService.getOrdersCount(params)
    .subscribe({
      next: (data:any) => {
        this.searchParams.OrdersCount = Number(data);
      },
      error: (error) => {
        console.log('Here is an error: '+ error);
      }
    });
  }

  toggleRowHighlight(index: number) {
    if (this.selectedRowIndex === index) {
      this.selectedRowIndex = -1; // Deselect the row if it's already selected
    } else {
      this.selectedRowIndex = index; // Select the clicked row
    }
  }

  viewOrderByCustomerId(custId: number, ordersCount: number, index: number, email: string){
    this.customerID = custId;
    if (this.selectedRowIndex === index) {
      this.selectedRowIndex = -1; // Deselect the row if it's already selected
    } else {
      this.selectedRowIndex = index; // Select the clicked row
    }
    this.isSortEnable = true;
    this.internalService.shopifyOrderSeachParams.OrdersCount = this.searchParams.OrdersCount = ordersCount;
    this.ordersList = [];
    this.getOrdersbyCUtomerId(custId, this.searchParams.OrdersType);
    this.getOrdersCount(email);
  }

  getOrdersbyCUtomerId(id:number, shortingType:string){
    this.searchParams.Orders = [];
    this.searchParams.OrdersCount = 0;
    this.searchParams.PageRecords = 10;
    this.orderSearchLoader = true;
    this.searchParams.OrdersExist = false;

    this.searchParams.NextURL = '';
    this.searchParams.PreviousURL = '';
    this.searchParams.CurrentPage = '';
    this.searchParams.OrdersType = 'desc';

    this.feedbackService.getOrdersByCustId(id, this.searchParams.PageRecords, shortingType)
    .subscribe({
      next: (response:any) => {
        this.orderSearchLoader = false;
        if (response && Array.isArray(response.orders)) {
          this.errorMessage = response.orders.length === 0 ? 'No records found.' : '';
          if (response.orders.length > 0) {
            this.assignValuesFromGetOrders(response);
          }
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (error) => {
        this.orderSearchLoader = false;
        console.log(error);
      }
    });
  }

  showNumberOfRecords(){
    if(this.searchParams.SearchType == 'phone' && this.ordersList.length > 0){
      this.getOrdersbyCUtomerId(this.customerID, this.searchParams.OrdersType);
    }else if(this.searchParams.SearchType == 'email'){
      this.searchOrders(this.searchParams.SearchType, this.searchParams.SearchValue);
      this.getOrdersCount(this.searchParams.SearchValue);
    }
  }

  private searchOrders(searchType: string, searchValue: string) {
    this.isSortEnable = (searchType === 'email');
    this.searchParams.SearchType = this.internalService.shopifyOrderSeachParams.SearchType = searchType;
    this.searchParams.SearchValue = this.internalService.shopifyOrderSeachParams.SearchValue = searchValue;
    this.internalService.ShopifyOrderPhoneNumber = (searchType === 'phone') ? searchValue : '';
    this.internalService.shopifyOrderSeachParams.OrdersCount = this.searchParams.OrdersCount = (searchType === 'order') ? 1 : 0;
    this.customerDetails = [];
    this.ordersList = [];


      this.orderSearchLoader = true;
      if (searchType === 'phone' && searchValue !== "") {
        this.getCutomerDetails(searchValue);
      } else {
        this.getOrders({'SearchType':searchType, 'SearchValue':searchValue, 'OrdersType':this.searchParams.OrdersType, 'PageRecords':this.searchParams.PageRecords});
      }

  }


  sortOrders(sortBy: string) {
    console.log("sortBy", sortBy == "asc");
    this.orderSearchLoader = true;
    this.searchParams.OrdersType = (sortBy == "asc") ? "asc" : "desc";
    console.log("sortBy", this.searchParams.OrdersType);
    if(this.searchParams.SearchType === 'email'){
      this.getOrders(this.searchParams);
      this.getOrdersCount(this.searchParams.SearchValue);
    }else if(this.searchParams.SearchType === "phone" && this.ordersList.length > 0) {
      this.getOrdersbyCUtomerId(this.customerID, sortBy);
      //this.getOrdersCount({'SearchType':'customer', 'SearchValue':this.customerID});
    }
  }

  clearData(){
    this.searchParams={
      SearchType:'',
      SearchValue:'',
      OrdersType:'desc',
      PageRecords:10,
      OrdersCount:0,
      OrdersExist:false,
      Orders:[],
      PreviousURL:'',
      NextURL:'',
      CurrentPage:'',
      CustomersExist:false,
      Customers:[],
      selectedRowIndex:-1,
      isSortEnable : false,
      DataSearched: false
    }

  }


}
