import { Injectable } from '@angular/core';
import { StaticDropdown } from '../../interface/StaticDropdown';
import { User } from '../../interface/User';
import { Router } from '@angular/router';
import { FeedbackService } from '../feedback-service/feedback.service';
import { SKUGroup } from '../../models/skuGroup.interface';
import { CallLogs } from '../../interface/CallLogs';
import { PaginationParams } from '../../interface/PaginationParams';

@Injectable({
  providedIn: 'root'
})
export class InternalService {


  userDetails!:User;

  // Dropdown Data
  dropdownData:StaticDropdown = { StampOne:[], StampTwo:[], Solutions:[], Shipping:[], Source:[], Assignee:[], TicketStatus:[], Complaint:[], ComplaintType:[], OrderEdited:[], CallsPickedUp:[], ReactionLevel:[], InvalidSKUs:[] };
  dropdownDataExist:boolean = false;

  //Shopify Order Search
  orderSelectedSKUs:any[] = [];
  feedbackForm = { email:'',  order_number: 0, phoneNumber: '', SKU: '', allSKUs : ''};
  itemsCount:number = 0;
  countryCode!:string;

  //Search history Values
  searchHistoryExist:boolean = false;
  orderSearchType:string | null = '';
  orderSearchValue:any;
  orderSearchCount:number = 0;
  orderSearchPhoneNumber:any;
  orderSearchPrevPage:any;
  orderSearchNextPage:any;
  orderSearchCurrentPage:any;

  skuGroupList:SKUGroup[] = [];

  orders:any;
  customerData:any;

  redirectPageUrl:string = '';

  //SKU Data...
  allSkusList:string[] = [];
  allSkusExist:boolean=false;

  //all Users
  allUsersList:any[] = [];
  allUsersExist:boolean = false;

  //all Cached Users
  allUsersCachedList:any[] = [];
  allUsersCachedExist:boolean = false;

  constructor(
    private router: Router,
    private feedbackService:FeedbackService
  ) {
    this.getUserDetails();
  }

  //Feedback Data After Form Submission Return To Feedback List Page
  feedbackUpdatePage:boolean = false;
  feedbackFormId:number = 0;
  feedbackformPayloadData:any;

  editStatus:boolean = false;
  upsaTrakingData:any;

  /**  Pagination Params For Feedback Tracker  Start */
  pagination:PaginationParams = {
    RecordsPerPage:10,
    TotalRecords:0,
    PageOffset:0,
    CurrentPage:1,
    TotalPages:0,
    PagesToDisplay:[],
  };
  paginationParamsExist:boolean = false;

  /**  Pagination Params For Feedback Tracker  End */

  async loadFirebaseAuthenticationConfig(){
    const cachedConfig = localStorage.getItem('firebaseConfig');
    if (!cachedConfig) {
      await this.feedbackService.firebaseAuthenticationConfig().subscribe({
        next: (data:any) => {
          localStorage.setItem('firebaseConfig', data);
          window.location.reload();
        },
        error: (error)=>{
          console.log("Here is the error"+ error);
          return;
        }
      })
    }

  }

  async loadStaticData(){
    // Make sure to return a promise here
    if(!this.dropdownDataExist){
      await this.feedbackService.getAllStaticData().subscribe((dataStatic:any) => {
        this.dropdownData.StampOne = dataStatic.stampOneLookUp;
        this.dropdownData.StampTwo = dataStatic.stampTwoLookUp;
        this.dropdownData.Solutions = dataStatic.solutions;
        this.dropdownData.Shipping = dataStatic.shipping;
        this.dropdownData.Source = dataStatic.source;
        this.dropdownData.Assignee = dataStatic.assigned;
        this.dropdownData.TicketStatus = dataStatic.logType;
        this.dropdownData.Complaint = dataStatic.complaint;
        this.dropdownData.OrderEdited = dataStatic.welcomeLogCallOrderEditedOrAssistance;
        this.dropdownData.CallsPickedUp = dataStatic.welcomeLogCallsPickedUp;
        this.dropdownData.ReactionLevel = dataStatic.welcomeLogCallsReactionLevel;
        this.dropdownData.InvalidSKUs = dataStatic.invalidSKU;
        this.dropdownData.ComplaintType = [];
        this.dropdownDataExist = true;
        dataStatic.complaint.map((c:any)=> {
          c.complaint_type.forEach((ct:any) => {
            this.dropdownData.ComplaintType.push(ct);
          });
        });

      });
    }
  }

  async loadSKUDetails() {
    if (!this.allSkusExist) {
      try {
        await this.feedbackService.getAllSKUs().subscribe((dataSKUS:any)=>{
          this.allSkusList = dataSKUS;
          this.allSkusExist = true;
        });
      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }
  }

  // As Jeff Asked to Add check for the Delivery Garentee From the SKU List if the Order Has it, On 4-March-2024
  deliveryGuaranteeExist:boolean = false;

  getInvalidSKU(pageId:number, itemSKU:string):boolean {
    const skuData = this.dropdownData.InvalidSKUs.find((sku:any) => sku.page_id == pageId);
    if (skuData && skuData.sku.length > 0) {
      // Check if the provided itemSKU matches any SKU in the skuData's sku array
      return !skuData.sku.some((skuObj:any) => skuObj.sku == itemSKU);
    }
    return true;
  }

  returnFilterdOrders(data: any[], page:number){
    data.map((order:any) => {
      this.deliveryGuaranteeExist = false;
      order.line_items = order.line_items.filter((item: any) => {
        if(item.sku == 'deliveryguarantee'){
          this.deliveryGuaranteeExist = true;
        }
        return this.getInvalidSKU(page, item.sku)
      });
    });
    return data;
  }

  returnFilterdOrdersShipStation(data: { items: any[]; }, page:number){
    data.items = data.items.filter((item: any) => this.getInvalidSKU(page, item.sku));
    return data;
  }



  async allUsers(){
    if(!this.allUsersExist){
      await this.feedbackService.allUsersList().subscribe((data:any) =>{
        this.allUsersList = data;
        this.allUsersExist = true;
      });
    }
  }

  async getUserDetails(){
    if(!this.allUsersCachedExist){
      await this.feedbackService.getCachedUsersList().subscribe((data:any) =>{
        this.allUsersCachedList = data;
        this.allUsersCachedExist = true;
      });
    }
  }


  // Shipping Station
  public returnsDetails:any;



  //Page Navigation
  navigatePage(page:string){
    this.router.navigate([page]);
  }

  //method to bind the staticdata with params
  getNameFromComplaintList(complaintId:string): string {
    const id = Number(complaintId);
    if (!isNaN(id) && complaintId !== '') {
    const complaint = this.dropdownData.Complaint.find((complaint:any) => Number(complaint.complaint_id) === id);

    return complaint ? complaint.complaint_name : 'Not Found';
    }else{
      return complaintId;
    }
  }

  getNameFromComplaintType(complaintType:any){
    const id = Number(complaintType);
    if (!isNaN(id) && complaintType !== '') {
      //console.log('this.dropdownData.ComplaintType', this.dropdownData.ComplaintType);
      const complaint = this.dropdownData.ComplaintType.find((complaint:any) => Number(complaint.id) === id);
      return complaint ? complaint.name : 'Not Found';
    }else{
      return complaintType;
    }
  }

  getNameFromAssignee(assigneeId:string):string{
    const id = Number(assigneeId);
    if (!isNaN(id) && assigneeId !== '') {
      const assignee = this.dropdownData.Assignee.find((asg:any) => (asg.id == id));
      return assignee ? assignee.assigned : 'Not Found';
    }else{
      return assigneeId;
    }
  }

  getNameFromSolution(solutionId:any){
    const id = Number(solutionId);
    if (!isNaN(id) && solutionId !== '') {
      const solution = this.dropdownData.Solutions.find((sol:any) => (sol.id == id));
      return solution ? solution.solution : 'Not Found';
    }else{
      return solutionId;
    }
  }

  getNameFromStamp1(stamp1Id:any){
    const id = Number(stamp1Id);
    if (!isNaN(id) && stamp1Id !== '') {
      const stamp1 = this.dropdownData.StampOne.find((st:any) => (st.id == id));
      return stamp1 ? stamp1.stamp_name : 'Not Found';
    }else{
      return stamp1Id;
    }
  }

  getNameFromStamp2(stamp2Id:any){
    const id = Number(stamp2Id);
    if (!isNaN(id) && stamp2Id !== '') {
      const stamp2 = this.dropdownData.StampTwo.find((st:any) => (st.id == id));
      return stamp2 ? stamp2.stamp2 : 'Not Found';
    }else{
      return stamp2Id;
    }
  }

  getNameFromShipping(shippingId:any){
    const id = Number(shippingId);
    if (!isNaN(id) && shippingId !== '') {
      const shipping = this.dropdownData.Shipping.find((sp:any) => (sp.id == id));
      return shipping ? shipping.stamp2 : 'Not Found';
    }else{
      return shippingId;
    }
  }

  getNameFromSource(sourceId:any){
    const id = Number(sourceId);
    if (!isNaN(id) && sourceId !== '') {
      const source = this.dropdownData.Source.find((sp:any) => (sp.id == id));
      return source ? source.source : 'Not Found';
    }else{
      return sourceId;
    }
  }

  getNameFromPickup(pId:any){
    const id = Number(pId);
    if (!isNaN(id) && pId !== 0) {
      const pickup = this.dropdownData.CallsPickedUp.find((sp:any) => (sp.Id == id));
      return pickup ? pickup.Picked_up : '';
    }else{
      return '';
    }
  }
  getNameFromReaction(rId:any){
    const id = Number(rId);
    if (!isNaN(id) && rId !== '') {
      const reaction = this.dropdownData.ReactionLevel.find((sp:any) => (sp.Id == id));
      return reaction ? reaction.Reaction_level : '';
    }else{
      return '';
    }
  }
  getNameFromEditedAssisted(eaId:any){
    const id = Number(eaId);
    if (!isNaN(id) && eaId !== '') {
      const edited = this.dropdownData.OrderEdited.find((sp:any) => (sp.Id==id));
      return edited ? edited.OrderEdited_or_assistance : '';
    }else{
      return '';
    }
  }

  getNameFromUsersList(uId:any){
    const id = Number(uId);
    if (!isNaN(id) && uId !== '') {
      const userDetails = this.allUsersCachedList.find(user => (user.id==id));
      return userDetails ? userDetails.name : '';
    }else{
      return '';
    }
  }


  shopifyOrderSeachParams={
    CurrentPage:'',
    SearchType:'',
    SearchValue:'',
    OrdersType:'',
    previousLink:'',
    nextLink:'',
    PreviousDataExist:false,
    orders:[],
    OrdersCount:0,
    RowsCount:0,
    redirectPageUrl:'',
    email:'',
    phone:'',
    order:'',
  };

  Customers:any[] = [];
  ShopifyOrderPhoneNumber:string='';


  //Calllogs JsonData Storing
  CallLogsJsonData:CallLogs = {
    LogId:0,
    OrderNumber:"",
    ShopifyCustomerLink:"",
    ShopifyOrderLink:"",
    CustomerName:"",
    Email:"",
    Phone:"",
    Address:"",
    TimeZone:"",
    Agent:0,
    GorgiasTicket:"",
    SKU:[],
    PickUp:0,
    ReactionLevel:0,
    OrderEdit_Assist:0,
    Comment:'',
    Comments:[],
    MIO:false,
    Canada:false,
    DeliveryGuarantee:false,
  };
  callLogDataExists:boolean = false;


  //Call-Logs Filters Custum Logic

  public fieldMappings = {
    'pickUp': {
        dataSource: 'CallsPickedUp',
        nameKey: 'Picked_up',
        valueKey: 'Id'
    },
    'reactionLevel': {
        dataSource: 'ReactionLevel',
        nameKey: 'Reaction_level',
        valueKey: 'Id'
    },
    'assisted': {
        dataSource: 'OrderEdited',
        nameKey: 'OrderEdited_or_assistance',
        valueKey: 'Id'
    },
    'agent': {
        customMapping: () => this.allUsersCachedList.filter(item => item.active === "True").map(item => ({
            name: item.name,
            value: item.id
        }))
    }
  };

  public defaultValue = {
      name: 'Select Option',
      value: 0
  };

  public fieldFilterMappings = {
    pickUp: {
        dataProperty: 'PickUpName',
        getFilterName: (selectedValue: any) => this.getNameFromPickup(selectedValue),
    },
    reactionLevel: {
        dataProperty: 'ReactionName',
        getFilterName: (selectedValue: any) => this.getNameFromReaction(selectedValue),
    },
    assisted: {
        dataProperty: 'AssistedName',
        getFilterName: (selectedValue: any) => this.getNameFromEditedAssisted(selectedValue),
    },
    agent: {
        dataProperty: 'AssistedName', // Note: This seems to be a mistake, should it be something like 'AgentName'?
        getFilterName: (selectedValue: any) => this.getNameFromUsersList(selectedValue),
    },
  };

  mapDataToOptions(data: any[], nameKey: string, valueKey: string): { name: any; value: any; }[] {
    return data.map(item => ({
        name: item[nameKey],
        value: item[valueKey]
    }));
  }


  initializeDateParams(params:any) {
    const currentDate = new Date();
    const previousMonthDate = new Date();
    previousMonthDate.setMonth(currentDate.getMonth() - 1);

    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const formattedPreviousMonthDate = previousMonthDate.toISOString().split('T')[0];

    // Set the date parameters for all properties
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        params[key].FromDate = formattedPreviousMonthDate;
        params[key].ToDate = formattedCurrentDate;
      }
    }
    return params;
  }


}
