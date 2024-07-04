import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { FeedbackForm } from '../../../interface/FeedbackForm';
import { FeedbackSKUGroup } from '../../../interface/FeedbackSKUGroup';
import { FeedbackJson } from '../../../interface/FeedbackJson';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';
import { ImagesRemoveCheckComponent } from '../../model-popup/images-remove-check/images-remove-check.component';
import { OrderIssueTrakerSource } from '../../../enum/OrderIssueTrakerSource.enum';
import { APIEndpoints } from '../../../services/api-endpoints/api-endpoints';
import { FilteringSKUsModule } from '../../../enum/FilteringSKUsModule.enum';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-feedback-tracker',
  templateUrl: './feedback-tracker.component.html',
  styleUrl: './feedback-tracker.component.css'
})
export class FeedbackTrackerComponent implements OnInit{

  pageTitle:string = 'Order Issue Tracker';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': 'Order Issue Tracker', 'link': 'order-issues-tracker', 'status':'inactive'},
    {'title': 'Shopify Order Search', 'link': 'orders_search', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'orders_search', 'status':'active'},
  ];

  skuCategorylist:any[] = [{}];

  sourceDropdown:any[] = [];

  //feedbackJsonData:any = {};

  feedbackJsonData:FeedbackJson = {
    orderId:'',
    MIO:false,
    order_placed_at:"",
    DeliveryGuarantee:false,
    DeliveryGuaranteeAgentCheck:false,
    Stamp1:0,
    Stamp2:0,
    Shipping:0,
    Return:false,
    Source:0,
    Assg:0,
    email:'',
    phone:'',
    SKU:'',
    allSKUs:'',
    SKUGroup:[],
    skuQuantityMap:[],
    customer_name:'',
    customerLink: '',
    orderLink:'',
    Country:false,
    fileUrls:[],
    SourceDisable:false,
    OrderUnique:'',
    CustomerId:'',
    skusEXIST:false,
  };

  feedbackForm: FeedbackForm = {
    id:0,
    logtype:0,
    json_data:this.feedbackJsonData,
    created_by:0,
    modified_by:0,
    status:0,
    comment:'',
  };
  skuSuggestiondetails:any[] = [];
  maditoryFields = {
    'OrderNumber':false,
    'CustomerMail':false,
    'PhoneNumber':false,
    'Source':false,
    'Assignee':false,
    'Status':false,
    'Shipping':false,
  }

  private queryParamsSubscription: Subscription | undefined;

  trackingDetailsExist:boolean = false;
  hideBasedOnAllSolutionSelected:boolean = false;
  trackingData:any;
  skuList:string[] = [];
  skusListTemp:string[] = [];

  solutionsListToBeHide:number[] = [11,16,17,4];


  imagePreviews: string[] = [];
  selectedFilesList: any[] = [];
  deletedImages: string[] = [];
  fileUrls:any[] = []

  comments:string = '';
  editStatus:boolean = false;
  feedbackStatus:number = 1;
  tickedId:number=0;
  editStatusf = false;

  commentsList:any[] = [];
  countSolutionChanges = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private feedbackService:FeedbackService,
    public internalService:InternalService,
    private imageCompress: NgxImageCompressService,
    private modalService: NgbModal,
    public toastService: ToastNotificationsService,

    ) { }

  ngOnInit(): void {
    this.getDataByParams();
    this.internalService.loadStaticData();
    this.internalService.loadSKUDetails();
    this.skusListTemp = this.internalService.allSkusList;
    this.sourceDropdown = this.internalService.dropdownData.Source;
  }

  private getDataByParams(): void {
    this.editStatus = false;
    this.queryParamsSubscription = this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
        if (params['TrackeId']) {
          this.initializeEditStatus(params['TrackeId']);
        } else if (params['email']) {
          this.initializeOrderDetails(params);
        }else if(params['Tracker']){
          this.intilizeEmptyForm();
        }
    });
  }

  private intilizeEmptyForm(){
    this.editStatusf = true;
    this.feedbackJsonData.SKUGroup = [];
    this.addSKUGroupDynamicRow();
  }

  private initializeEditStatus(trackId: string): void {
      this.tickedId = Number(trackId);
      this.feedbackJsonData.skusEXIST = this.editStatus = true;
      this.getTickDataById(this.tickedId);
  }

  private initializeOrderDetails(params: any): void {
      this.tickedId = 0;
      this.getOrderDetailsByEmail(params);
  }

  async getTickDataById(trackid:number){
    await this.feedbackService.getTicketById(trackid).subscribe((originalData:any)=>{
      this.assignEditedData(originalData[0]);
     });
  }

  showTooltip(): boolean {
    return (this.feedbackJsonData.SKU === 'FULL-ORDER' && this.feedbackJsonData.allSKUs) ? true : false;
  }

  getTooltipContent(feedBack:any): string {
    if (feedBack.allSKUs) {
      return feedBack.allSKUs;
    }
    return '';
  }

  assignEditedData(data:any){
    this.commentsList = [];
    this.commentsList = data.comments;
    const json_data = data.json_data;
    this.feedbackJsonData.customerLink = json_data.ShopifyCustomerLink;
    this.feedbackJsonData.orderLink = json_data.ShopifyOrderLink;
    this.imagePreviews = (json_data.signed_file_urls) ? JSON.parse(json_data.signed_file_urls) : [];
    this.feedbackJsonData.fileUrls = this.fileUrls = (json_data.fileUrls) ? JSON.parse(json_data.fileUrls) : [];
    this.feedbackJsonData.SKUGroup = [];
    this.feedbackJsonData.Assg = data.json_data.Assg;
    this.feedbackJsonData.OrderUnique = (data.json_data.OrderUnique) ? data.json_data.OrderUnique : '';
    this.feedbackJsonData.CustomerId = (data.json_data.CustomerId) ? data.json_data.CustomerId: '';
    this.feedbackJsonData.DeliveryGuaranteeAgentCheck = (json_data.DeliveryGuaranteeAgentCheck) ? json_data.DeliveryGuaranteeAgentCheck : false;
     data.json_data.SKUGroup.map((sku:FeedbackSKUGroup, index:number) => {
      sku.Complaint = Number(sku.Complaint);
      sku.Errors.ShowComplaintError =  (sku.Complaint == 0);
      sku.Solution = Number(sku.Solution);
      sku.Errors.ShowSolutionError =  (sku.Solution == 0);
      sku.TypeOfComplaint = Number(sku.TypeOfComplaint);
      sku.Errors.ShowComplaintTypeError =  (sku.TypeOfComplaint == 0);
      sku.skuQuantity = Number(sku.skuQuantity);
      sku.skuQuantityTemp = Number(sku.skuQuantityTemp);
      sku.ComplaintDropdown = this.internalService.dropdownData.Complaint.sort((a, b) => {
        return a.complaint_name.localeCompare(b.complaint_name);
      });
      sku.TypeOfComplaintDropdwon=this.internalService.dropdownData.ComplaintType.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      sku.SolutionDropdwon=this.internalService.dropdownData.Solutions.sort((a, b) => {
        return a.solution.localeCompare(b.solution);
      });
      if(!this.solutionsListToBeHide.includes(sku.Solution)){
        sku.QtyReplaced = 0;
        sku.SKUReplaced = '';
        sku.hideBasedOnSolutionSelected = true;
        this.countSolutionChanges++;
      }
    });
    if(this.countSolutionChanges > 0){
      this.hideBasedOnAllSolutionSelected = true;
      this.feedbackJsonData.Shipping = 0;
    }else{
      this.hideBasedOnAllSolutionSelected = false;
    }
    this.feedbackJsonData.SKUGroup = data.json_data.SKUGroup;
    this.feedbackJsonData.Return = data.json_data.Return;
    this.feedbackJsonData.Stamp1 = Number(data.json_data.Stamp1);
    this.feedbackJsonData.Shipping = Number(data.json_data.Shipping);
    this.feedbackJsonData.Source = Number(data.json_data.Source);
    this.feedbackStatus = (data.status == "Solved") ? 3 : 1;
    this.feedbackJsonData.email = data.json_data.email;
    this.feedbackJsonData.phone = data.json_data.phone;
    this.feedbackJsonData.orderId = data.json_data.orderId;
    this.feedbackJsonData.SKU = data.json_data.SKU;
    this.feedbackJsonData.MIO = data.json_data.MIO;
    this.feedbackJsonData.Country = data.json_data.Country;
    this.skuList = data.json_data.SKU.split(',');
    this.getOrderBasicDetails(this.feedbackJsonData.orderId);
  }

  getOrderDetailsByEmail(params:any){
    this.getOrderBasicDetails(params['orderId']);
    this.feedbackJsonData.email = params['email'];
    this.feedbackJsonData.orderId = params['orderId'];
    this.feedbackJsonData.phone = params['phone'];
    this.feedbackJsonData.allSKUs = (params['allSKUs']) ? params['allSKUs'] : '';
    const customerId = params['customerId'];
    const orderUniqId = params['orderUniqId'];
    this.feedbackJsonData.OrderUnique = orderUniqId;
    this.feedbackJsonData.CustomerId = customerId;
    this.feedbackJsonData.MIO = (Number(params['itemsCount']) > 1) ? true : false;
    this.feedbackJsonData.skusEXIST = (Number(params['itemsCount']) > 0) ? true : false;
    this.feedbackJsonData.SKU = (!this.feedbackJsonData.MIO) ? (params['allSKUs']) ? params['allSKUs'] : params['skus'] : params['skus'];
    this.feedbackJsonData.Country = ((params['country']) && (params['country'] === 'CA')) ? true : false;

    if(this.feedbackJsonData.SKU && this.feedbackJsonData.SKU != ''){
      this.creatingSKUGroup();
    }

  }

  addSKUGroupDynamicRow(){
    const SKUGroup = {
      SKU:"",
      Complaint:0,
      ComplaintDropdown:this.internalService.dropdownData.Complaint.sort((a, b) => {
        return a.complaint_name.localeCompare(b.complaint_name);
      }),
      TypeOfComplaint:0,
      TypeOfComplaintDropdwon:this.internalService.dropdownData.ComplaintType.sort((a, b) => {
        return a.name.localeCompare(b.name);
      }),
      Solution:0,
      SolutionDropdwon:this.internalService.dropdownData.Solutions.sort((a, b) => {
        return a.solution.localeCompare(b.solution);
      }),
      QtyReplaced:0,
      skuQuantity:0,
      skuQuantityTemp:0,
      SKUReplaced:'',
      ShowSkuSuggestion:false,
      hideBasedOnSolutionSelected:false,
      SkusList:this.internalService.allSkusList,
      Errors: {
        'ShowComplaintError':false,
        'ShowComplaintTypeError':false,
        'ShowQuantityError':false,
        'ShowSolutionError':false
      }
    };
    this.feedbackJsonData.SKUGroup.push(SKUGroup);
    this.feedbackJsonData.MIO = this.feedbackJsonData.SKUGroup.length > 1;
  }

  removeRow(index:number){
    this.feedbackJsonData.SKUGroup.splice(index, 1);
    this.feedbackJsonData.MIO = this.feedbackJsonData.SKUGroup.length > 1;
  }

  getSKUlist(): string {
    return this.feedbackJsonData.SKUGroup.map((sku: any) => sku.SKU).join(', ');
  }

  creatingSKUGroup(){
    const slectedSKUsList:string[] = this.skuList = this.feedbackJsonData.SKU.split(',');
    this.feedbackJsonData.SKUGroup = [];
    slectedSKUsList.forEach((sku:string) => {
      const SKUGroup = {
        SKU:(this.feedbackJsonData.skusEXIST) ? sku : '',
        Complaint:0,
        ComplaintDropdown:this.internalService.dropdownData.Complaint.sort((a, b) => {
          return a.complaint_name.localeCompare(b.complaint_name);
        }),
        TypeOfComplaint:0,
        TypeOfComplaintDropdwon:this.internalService.dropdownData.ComplaintType.sort((a, b) => {
          return a.name.localeCompare(b.name);
        }),
        Solution:0,
        SolutionDropdwon:this.internalService.dropdownData.Solutions.sort((a, b) => {
          return a.solution.localeCompare(b.solution);
        }),
        QtyReplaced:0,
        skuQuantity:0,
        skuQuantityTemp:0,
        SKUReplaced:'',
        ShowSkuSuggestion:false,
        hideBasedOnSolutionSelected:false,
        SkusList:this.internalService.allSkusList,
        Errors: {
          'ShowComplaintError':false,
          'ShowComplaintTypeError':false,
          'ShowQuantityError':false,
          'ShowSolutionError':false
        }
      };
      this.feedbackJsonData.SKUGroup.push(SKUGroup);
      const skudetails = {
        'skuList':this.internalService.allSkusList,
        'skuExist':this.internalService.allSkusExist,
        'ShowSkuSuggestion':false
      }
      this.skuSuggestiondetails.push(skudetails);
    });
  }



  getTrakingData(orderId:string){
    if(!this.trackingDetailsExist){
      this.feedbackService.getOrdersNew({'SearchType':'order', 'SearchValue':orderId, 'PageRecords':0, 'OrdersType':'desc'}).subscribe((data:any) => {
        data.orders = this.internalService.returnFilterdOrders(data.orders, FilteringSKUsModule.FeedbackTracker);
        if(this.checkSKUQuantityDisplay() && !this.internalService.editStatus){

          this.skuCategorylist.forEach(skuQuantityItem => {
            const matchingLineItem = data.orders[0].line_items.find((lineItem:any) => lineItem.sku === skuQuantityItem.SKU);
            if (matchingLineItem) {
              skuQuantityItem.skuQuantityTemp = skuQuantityItem.skuQuantity = matchingLineItem.quantity;
            }else if(this.checkSKUQuantityDisplay()){
              skuQuantityItem.skuQuantityTemp = skuQuantityItem.skuQuantity = data.orders[0].line_items[0].quantity;
            }
          });
        }

        this.feedbackJsonData.skuQuantityMap = [];
        data.orders[0].line_items.forEach((item:any) => {
          const skuQuantityMap = {
            sku: item.sku,
            skuQuantity: item.quantity
          }
          this.feedbackJsonData.skuQuantityMap.push(skuQuantityMap)
        });
        if(data.orders[0]?.fulfillments && data.orders[0]?.fulfillments[0]){
          this.trackingData = this.internalService.upsaTrakingData = {
            'status': data.orders[0].fulfillments[0].status,
            'tracking_company': data.orders[0].fulfillments[0].tracking_company,
            'tracking_number': data.orders[0].fulfillments[0].tracking_number,
            'tracking_url': data.orders[0].fulfillments[0].tracking_url
          }
          this.trackingDetailsExist = true;
        }else{
          this.trackingDetailsExist = false;
        }

      });
    }
  }

  updateDropdownSource(data:any) {
    this.feedbackJsonData.order_placed_at = data.created_at;
    if (this.internalService.dropdownData.Source && data.source !== '') {
      const source = this.internalService.dropdownData.Source.find(s => data.source.includes(s.source));
      if (source) {
        this.feedbackJsonData.SourceDisable = true;
        this.feedbackJsonData.Source = source.id;
      }
    } else {
      // Handle the case where order.source is empty or invalid
      this.feedbackJsonData.SourceDisable = false;
    }

  }

  checkSKUQuantityDisplay():boolean{
    return ((this.feedbackJsonData.SKU === 'FULL-ORDER' && !this.feedbackJsonData.MIO) || (this.feedbackJsonData.SKU !== 'FULL-ORDER'));
  }

  changeOption($event:any, Complaint:number, index:number){
    if(Complaint === 0){
      this.feedbackJsonData.SKUGroup[index].Errors.showComplaintError = true;
    }else{
      this.feedbackJsonData.SKUGroup[index].Errors.showComplaintError = false;
    }
    this.feedbackJsonData.SKUGroup[index].TypeOfComplaintDropdwon = this.internalService.dropdownData.ComplaintType.filter((x:any) =>  x.complaint_id == $event.target.value);
  }

  changeComplaintTypeOption(index:number){
    if(this.feedbackJsonData.SKUGroup[index].TypeOfComplaint === 0){
      this.feedbackJsonData.SKUGroup[index].Errors.ShowComplaintTypeError = true;
    } else{
      this.feedbackJsonData.SKUGroup[index].Errors.ShowComplaintTypeError = false;
    }
  }


  changeSolution(SolutionIndex:number, event:any) {
    this.countSolutionChanges = 0;
    const solution = Number(event.target.value);
    if(solution != 0){
      this.feedbackJsonData.SKUGroup[SolutionIndex].Errors.showSolutionError = false;
    }
    if(!this.solutionsListToBeHide.includes(solution)){
      this.feedbackJsonData.SKUGroup[SolutionIndex].QtyReplaced = 0;
      this.feedbackJsonData.SKUGroup[SolutionIndex].SKUReplaced = '';
      this.feedbackJsonData.SKUGroup[SolutionIndex].hideBasedOnSolutionSelected = true;
    }else{
      this.feedbackJsonData.SKUGroup[SolutionIndex].hideBasedOnSolutionSelected = false;
    }

    this.feedbackJsonData.SKUGroup.map((sku:FeedbackSKUGroup, index:number)=>{
      if(!this.solutionsListToBeHide.includes(solution)){

        this.countSolutionChanges++;
      }
    });

    if(this.countSolutionChanges > 0){
      this.hideBasedOnAllSolutionSelected = true;
      this.feedbackJsonData.Shipping = 0;
    }else{
      this.hideBasedOnAllSolutionSelected = false;
    }
  }

  restrictInputValue(event: Event, index: number, sKUMainQty:number): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = parseFloat(inputElement.value);

    if (!isNaN(inputValue) && inputValue > sKUMainQty) {
      inputElement.value = sKUMainQty.toString();
      this.feedbackJsonData.SKUGroup[index].skuQuantity = sKUMainQty;
    }
  }

  changeQuantityValue($event:any, index:number){
    if(this.feedbackJsonData.SKUGroup[index].QtyReplaced == 0 || isNaN(this.feedbackJsonData.SKUGroup[index].QtyReplaced)){
      this.feedbackJsonData.SKUGroup[index].Errors.ShowQuantityError = false;
    } else{
      this.feedbackJsonData.SKUGroup[index].Errors.ShowQuantityError = true;
    }
  }

  autosku(event: any, index: number) {
    const value = event.target.value.trim(); // Remove leading/trailing white spaces

    if (value.length  < 2) {
      this.feedbackJsonData.SKUGroup[index].ShowSkuSuggestion = false;
      return;
    }
    this.feedbackJsonData.SKUGroup[index].ShowSkuSuggestion = true;
    this.feedbackJsonData.SKUGroup[index].SkusList = this.skusListTemp.filter((option: string) => option.toLowerCase().startsWith(value.toLowerCase())).sort();
    this.feedbackJsonData.SKUGroup[index].ShowSkuSuggestion = (this.feedbackJsonData.SKUGroup[index].SkusList.length > 0);
  }

  clearSkuList(index:number){
    this.feedbackJsonData.SKUGroup[index].ShowSkuSuggestion = false;
  }

  selectedSku(sku:string, index:number){
    this.feedbackJsonData.SKUGroup[index].SKUReplaced = sku;
    this.feedbackJsonData.SKUGroup[index].ShowSkuSuggestion = false;
  }



  redirectLinks(orderUniqId: string, customerId: string): void {
    const source = this.feedbackJsonData.Source;
    if (source === OrderIssueTrakerSource.WALMART) {
      this.setLinks(environment.WalmartURL, orderUniqId);
    } else if (source === OrderIssueTrakerSource.AMAZON) {
      this.setLinks(environment.AmazonURL, orderUniqId);
    } else {
      this.setLinks(environment.ShopifyCustomerURL, customerId, environment.ShopifyOrderURL, orderUniqId);
      this.filterSourceDropdown();
    }
  }

  private setLinks(customerBaseUrl: string, customerId: string, orderBaseUrl: string = '', orderUniqId: string = ''): void {
    this.feedbackJsonData.customerLink = `${customerBaseUrl}${customerId}`;
    this.feedbackJsonData.orderLink = (orderBaseUrl != '' && orderUniqId != '') ? `${orderBaseUrl}${orderUniqId}` : `${customerBaseUrl}${customerId}`;
  }

  filterSourceDropdown(): void {
    this.sourceDropdown = this.internalService.dropdownData.Source.filter((source: any) => {
      return source.id !== OrderIssueTrakerSource.AMAZON && source.id !== OrderIssueTrakerSource.WALMART;
    });
  }

  getOrderBasicDetails(orderNumber: any): void {
    const searchOrder = {
      SearchType: 'order',
      SearchValue: orderNumber,
      OrderType: 'desc',
    };
    this.feedbackService.getOrdersNew(searchOrder).subscribe({
      next: (data: any) => {
        this.processOrderDetails(data.orders, orderNumber);
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }

  processOrderDetails(orders: any[], orderNumber: any): void {
    const filteredOrders = this.internalService.returnFilterdOrders(orders, FilteringSKUsModule.FeedbackTracker);
    const orderDetails = filteredOrders.find((order: any) => order.order_number === orderNumber);

    if (orderDetails) {
      this.feedbackJsonData.DeliveryGuarantee = this.internalService.deliveryGuaranteeExist;
      this.updateSKUQuantities(orderDetails);
      this.updateCustomerName(orderDetails.customer);
      this.updateTrackingData(orderDetails.fulfillments);
      this.updateDropdownSource(filteredOrders[0]);
      this.redirectLinks(this.feedbackJsonData.OrderUnique, this.feedbackJsonData.CustomerId);
    }
  }

  updateSKUQuantities(orderDetails: any): void {
    this.feedbackJsonData.SKUGroup.forEach((sku: any) => {
      const matchingLineItem = orderDetails.line_items.find((lineItem: any) => lineItem.sku === sku.SKU);
      if (matchingLineItem) {
        sku.skuQuantityTemp = sku.skuQuantity = matchingLineItem.quantity;
      } else if (this.checkSKUQuantityDisplay()) {
        sku.skuQuantityTemp = sku.skuQuantity = orderDetails.line_items[0].quantity;
      }
    });
  }

  updateCustomerName(customer: any): void {
    this.feedbackJsonData.customer_name = `${customer.first_name} ${customer.last_name}`;
  }

  updateTrackingData(fulfillments: any[]): void {
    if (fulfillments && fulfillments[0]) {
      const fulfillment = fulfillments[0];
      this.trackingData = this.internalService.upsaTrakingData = {
        status: fulfillment.status,
        tracking_company: fulfillment.tracking_company,
        tracking_number: fulfillment.tracking_number,
        tracking_url: fulfillment.tracking_url,
      };
      this.trackingDetailsExist = true;
    } else {
      this.trackingDetailsExist = false;
    }
  }

  onFileSelected(event: any): void {
    if (this.imagePreviews.length >= 4) {
      // Handle the case where the maximum number of images (4) has been reached
      // You can show an error message or take any other necessary action.
      return;
    }

    const selectedFiles: File[] = Array.from(event.target.files);

    const remainingSlots = 4 - this.imagePreviews.length;
    const filesToProcess = selectedFiles.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContents = e.target?.result as string;
        if (file.size > 1024 * 1024) {
          // Handle the case where the total file size exceeds 1MB
          // You can show an error message or take any other necessary action.
          this.compressImage(file);
        }else{
          this.imagePreviews.push(fileContents);
          this.selectedFilesList.push(file);
        }
      };


      reader.readAsDataURL(file);

    }
  }

  compressImage(file: File): void {
    const reader = new FileReader();

    reader.onload = (event) => {
      const base64String = event.target?.result as string;

      this.imageCompress
        .compressFile(base64String, -1, 50, 50)
        .then((result: any) => {
          // 'result' is the compressed image as a base64 string
          const fileImage = this.base64ToFile(result, file.name, file.type);
          this.imagePreviews.push(result);
          this.selectedFilesList.push(fileImage);
        });
    };

    reader.readAsDataURL(file);
  }

  base64ToFile(base64: string, filename: string, mimeType: string): File {
    const binaryString = window.atob(base64.split(',')[1]);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);

    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new File([bytes], filename, { type: mimeType });
  }

  removeImage(index: number): void {
    const modalRefApprove = this.modalService.open(ImagesRemoveCheckComponent);
    modalRefApprove.componentInstance.ImageData.subscribe((data: any) => {
      // Move the removed image to the deletedImages array
      this.deletedImages.push(this.fileUrls[index]);
      this.imagePreviews.splice(index, 1);
      this.selectedFilesList.slice(index, 1);
    });
  }


  validateForm(){
    let count = 0;
    this.feedbackJsonData.SKUGroup.forEach((sku: FeedbackSKUGroup) => {
      count += (sku.SKU.trim() != '')  ? 0 : 1;
      sku.Errors.ShowSKUError = (sku.SKU.trim() == '');
      count += (sku.Complaint != 0)  ? 0 : 1;
      sku.Errors.ShowComplaintError = (sku.Complaint == 0);
      count += (sku.TypeOfComplaint != 0) ? 0 : 1;
      sku.Errors.ShowComplaintTypeError = (sku.TypeOfComplaint == 0);
      count += (sku.Solution != 0) ? 0 : 1;
      sku.Errors.ShowSolutionError = (sku.Solution == 0);
    });
    count += (this.feedbackJsonData.orderId.trim() != '') ? 0 : 1;
    this.maditoryFields.OrderNumber = (this.feedbackJsonData.orderId.trim() == '');
    count += (this.feedbackJsonData.email.trim() != '') ? 0 : 1;
    this.maditoryFields.CustomerMail = (this.feedbackJsonData.email.trim() == '');
    count += (this.feedbackJsonData.phone.trim() != '') ? 0 : 1;
    this.maditoryFields.PhoneNumber = (this.feedbackJsonData.phone.trim() == '');
    count += (this.feedbackJsonData.Source != 0) ? 0 : 1;
    this.maditoryFields.Source = (this.feedbackJsonData.Source == 0);
    count += (this.feedbackJsonData.Assg != 0) ? 0 : 1;
    this.maditoryFields.Assignee = (this.feedbackJsonData.Assg == 0);
    count += (this.feedbackStatus != 0) ? 0 : 1;
    this.maditoryFields.Status = (this.feedbackStatus == 0);
    return count;
  }



  onSubmit() {
    const feedbackId = this.tickedId;
    let count = this.validateForm();
    let countSolutionChanges = 0;
    if (count === 0) {
      if (countSolutionChanges > 0) {
        this.hideBasedOnAllSolutionSelected = false;
        this.feedbackJsonData.Shipping = 0;
      } else {
        this.hideBasedOnAllSolutionSelected = true;
        this.maditoryFields.Shipping = this.feedbackJsonData.Shipping ? true : false;
      }
      this.feedbackJsonData.SKUGroup.forEach((sku: FeedbackSKUGroup) => {
        sku.ComplaintDropdown = [];
        sku.TypeOfComplaintDropdwon = [];
        sku.SolutionDropdwon = [];
        sku.SkusList = [];
      });

      const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');

      const feedbackForm: FeedbackForm = {
        id: feedbackId,
        logtype: 1,
        json_data: this.feedbackJsonData,
        created_by: authUser.id,
        modified_by: authUser.id,
        status: this.feedbackStatus,
        comment: this.comments
      };

      const formData = new FormData();

      // Append form fields
      formData.append('id', feedbackId.toString());
      formData.append('logtype', '1');
      formData.append('json_data', JSON.stringify(this.feedbackJsonData));
      formData.append('created_by', authUser.id.toString());
      formData.append('modified_by', authUser.id.toString());
      formData.append('status', this.feedbackStatus.toString());
      formData.append('comment', this.comments);
      formData.append('deletedImages', JSON.stringify(this.deletedImages));
      // Append files
      for (let i = 0; i < this.selectedFilesList.length; i++) {
        const imageUrl = this.selectedFilesList[i];
        formData.append(`image{i}`, imageUrl);

      }

      this.feedbackService.submitFeedback(formData).subscribe();
      if (this.editStatus) {
        this.internalService.feedbackUpdatePage = true;
        this.internalService.feedbackformPayloadData = feedbackForm;
        this.toastService.showSuccess('Success!', 'Feedback Updated Successfully.');
        this.router.navigateByUrl('order-issues-tracker');
      } else {
        this.toastService.showSuccess('Success!', 'Feedback Inserted Successfully.');
        (this.internalService.shopifyOrderSeachParams.redirectPageUrl !== '') ? this.router.navigateByUrl(this.internalService.shopifyOrderSeachParams.redirectPageUrl) : this.router.navigateByUrl('/orders_search');

      }
    }
  }
}
