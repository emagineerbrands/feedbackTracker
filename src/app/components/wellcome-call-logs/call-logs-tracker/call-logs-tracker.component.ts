import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CallLogs } from '../../../interface/CallLogs';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { InternalService } from '../../../services/internal-service/internal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';
import * as moment from 'moment-timezone';
import * as cityTimezones from 'city-timezones';
import { TimeZoneService } from '../../../services/time-zone-service/time-zone.service';
import { WelcomeCallLogService } from '../../../services/welcome-call-log-service/welcome-call-log.service';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-call-logs-tracker',
  templateUrl: './call-logs-tracker.component.html',
  styleUrl: './call-logs-tracker.component.css'
})

export class CallLogsTrackerComponent implements OnInit, AfterViewInit, OnDestroy {

  form!: FormGroup;

  pageTitle:string = 'Welcome Calls Tracker';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': 'Welcome Calls', 'link': 'welcome-calls', 'status':'inactive'},
    {'title': this.pageTitle, 'link': '', 'status':'active'},
  ];
  customerTime: string = '';
  private intervalId?: number;

  private queryParamsSubscription: Subscription | undefined;

  loader:boolean = false;
  commentsList:any[] = [];

  callLogs:CallLogs = {
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
  tempListedBrands:string[] = [];
  validations = {
    pickedUp:false,
    edited_assited:false,
  };

  constructor(
    private welcomeCallLogService:WelcomeCallLogService,
    public internalService:InternalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public toastService: ToastNotificationsService,
    private formBuilder: FormBuilder,
    public timeZone: TimeZoneService,
  ){

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      callLogsPickUp: [0, Validators.required], // Add required validator for "Picked Up" field
      callLogsEditedOrAssist: [0, Validators.required],
      // Add other controls here
    });
    // Use the country code relevant to your customer
    // Update every minute
    this.queryParamsSubscription = this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      if (params['log-id']) {
        this.callLogs.LogId = params['log-id'];
        this.searchOrderById(params['log-id']);
      }
    });
    //this.triggerSnapshot();
    this.internalService.callLogDataExists = false;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }


  ngAfterViewInit(): void {
  }






  async searchOrderById(id:number){
    this.loader = true;
    await this.welcomeCallLogService.callLogsById(id).subscribe((res:any) => {
      this.assignData(res[0]);
      this.loader = false;
    });
  }

  updateCustomerTime(countryCode: string, provinceCode: string): void {
    const timezone = this.timeZone.getTimeZone(countryCode, provinceCode);
    if (timezone) {
      this.intervalId = window.setInterval(() => {
        //const now = moment();
        //this.customerTime = moment().tz(timezone).format('MM-DD-YYYY hh:mm:ss A');
        this.customerTime = "";
      }, 1000);
      // Format the live time in the given timezone with AM/PM

    } else {
      console.warn('Timezone not found for country code:', countryCode);
      // Handle cases where the timezone is not found
    }
  }

  assignData(data:any){
    this.commentsList = data.comments;
    // Check if shopify_order_json is already an array, if not, temporarily wrap it in one
    const isDataArray = Array.isArray(data.json_data.shopify_order_json);
    const inputData = isDataArray ? data.json_data.shopify_order_json : [data.json_data.shopify_order_json];

    // Process the data (now guaranteed to be in an array format)
    const processedData = this.internalService.returnFilterdOrders(inputData, 2);

    // If the original data was not an array, unwrap the processed data from the array
    data.json_data.shopify_order_json = isDataArray ? processedData : processedData[0];
    //data.json_data.shopify_order_json = this.internal.returnFilterdDataShopify(data.json_data.shopify_order_json);
    this.callLogs.DeliveryGuarantee = this.internalService.deliveryGuaranteeExist;
    this.callLogs.CustomerName = data.json_data.shopify_order_json.customer.first_name+' '+data.json_data.shopify_order_json.customer.last_name;
    this.callLogs.OrderNumber = data.json_data.shopify_order_json.order_number;
    this.callLogs.Email = data.json_data.shopify_order_json.customer.email;
    const customerId = data.json_data.shopify_order_json.customer.id;
    const orderUniqId = data.json_data.shopify_order_json.id;
    this.callLogs.ShopifyCustomerLink = 'https://admin.shopify.com/store/honest-ppe-supply/customers/'+customerId;
    this.callLogs.ShopifyOrderLink = 'https://admin.shopify.com/store/honest-ppe-supply/orders/'+orderUniqId;
    this.callLogs.Phone = data.json_data.shopify_order_json.shipping_address?.phone;
    const addressObj = data.json_data.shopify_order_json.shipping_address;

    // Create an array of address components
    let addressComponents = [
      addressObj.first_name ? addressObj.first_name + ' ' + addressObj.last_name : '',
      addressObj.address1,
      addressObj.city,
      addressObj.province,
      addressObj.country,
      addressObj.zip
    ];

    // Filter out any null, undefined, or empty string values
    addressComponents = addressComponents.filter(component => component && component.trim() !== '');

    // Join the remaining components with a comma and a space
    this.callLogs.Address = addressComponents.join(', ');
    if(data.json_data.shopify_order_json.shipping_address){
      this.updateCustomerTime(data.json_data.shopify_order_json.shipping_address.country_code, data.json_data.shopify_order_json.shipping_address.province_code);
    }
    this.callLogs.MIO = (data.json_data.shopify_order_json.line_items.length > 1);
    this.callLogs.SKU = data.json_data.shopify_order_json.line_items.map((item:any) => item.sku);
    this.ngAfterViewInit();
    if(data.json_data.form_json_data){
      this.bindJsondata(data.json_data.form_json_data);
    }
    this.tempListedBrands = this.callLogs.SKU;
  }

  bindJsondata(json_data:any){
    //console.log('json_data', json_data);
    //this.callLogs.SKU
    this.callLogs.SKU = json_data.SKU;
    this.callLogs.PickUp = Number(json_data.PickUp);
    this.callLogs.ReactionLevel = Number(json_data.ReactionLevel);
    this.callLogs.OrderEdit_Assist = Number(json_data.OrderEdit_Assist);
  }


  pageNavigate(page:string){
    this.router.navigate([page]);
  }

  validationFields(){
    let count = 0;
    if(this.callLogs.PickUp == 0){
      this.validations.pickedUp = true;
      count++;
    }else{
      this.validations.pickedUp = false;
    }
    if(this.callLogs.OrderEdit_Assist == 0){
      this.validations.edited_assited = true;
      count++;
    }else{
      this.validations.edited_assited = false;
    }
    return count;
  }

  submitForm(){
    this.internalService.CallLogsJsonData = this.callLogs;
    if(this.validationFields() == 0){
      const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
      this.callLogs.Agent = authUser.id;
      const formData = new FormData();
        // Append form fields
      this.internalService.callLogDataExists = true;
      formData.append('id', this.callLogs.LogId.toString());
      formData.append('json_data', JSON.stringify(this.callLogs));
      formData.append('created_by', authUser.id);
      formData.append('modified_by', authUser.id);
      formData.append('status', this.callLogs.OrderEdit_Assist.toString());
      formData.append('comment', this.callLogs.Comment);
      this.welcomeCallLogService.submitCallLogs(formData).subscribe({
        next:(data:any) => {
          this.toastService.showSuccess('Success!', 'Call-Log Updated Successfully.');

        },
        error:(error)=>{
          console.log('There is an Error', error);
        }
      });
      this.router.navigate(['/welcome-calls']);
    }

  }

}
