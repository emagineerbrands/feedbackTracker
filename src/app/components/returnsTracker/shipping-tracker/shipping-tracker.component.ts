import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { Returns } from '../../../models/returns.interface';
import { RetrunsSkuGroup } from '../../../models/returnsSkuGroup.interface';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageService } from '../../../services/image-service/image.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { DatePipe } from '@angular/common';
import { ReturnsService } from '../../../services/returns-service/returns.service';
import { ShortDatePipe } from '../../../customPipes/short-date.pipe';
import { FeedbackService } from '../../../services/feedback-service/feedback.service';
import { ToastNotificationsService } from '../../../services/toast-notification-service/toast-notifications.service';
import { InternalService } from '../../../services/internal-service/internal.service';
import { ImagesRemoveCheckComponent } from '../../model-popup/images-remove-check/images-remove-check.component';
import { FilteringSKUsModule } from '../../../enum/FilteringSKUsModule.enum';

@Component({
  selector: 'app-shipping-tracker',
  templateUrl: './shipping-tracker.component.html',
  styleUrls: ['./shipping-tracker.component.css']
})
export class ShippingTrackerComponent implements OnInit {

  pageTitle:string = 'Returns Tracker';
  breadCrumbList:any[] = [
    {'title': 'Home', 'link': '', 'status':'inactive'},
    {'title': 'Returns Tracker Details', 'link': 'returns', 'status':'inactive'},
    {'title': 'Returns Order Search', 'link': 'returns_order_search', 'status':'inactive'},
    {'title': this.pageTitle, 'link': 'returns', 'status':'active'},
  ];
  public webcamImage: WebcamImage | undefined;
  public errors: WebcamInitError[] = [];

  private trigger: Subject<void> = new Subject<void>();
  public trigger$: Observable<void> = this.trigger.asObservable();


  private queryParamsSubscription: Subscription | undefined;
  orderData:any
  allSkus: string[] = [];
  allItemsData: any[] = [];
  ordersList: any[] = [];
  allItemIds!:string;
  returnsTracker:Returns = { id:0, orderId:0, orderType:'Existing-Order', orderNumber:'', ossOrderNum:0, customer:'', customerMail:'', orderDate:'', orderShortDate:'', storeId:0,storeName:'', tags:'', MIO:false, outSideShipStation:false, country:false, skuGroup:[], quantityReturnedInTotal:0, quantityDamagedInTotal:0, updateStatus:1, fileUrls: [], images:null, comment:'', comments:[] };
  dynamicRows: any[] = [];
  skuGroup:RetrunsSkuGroup[] = [];
  previewImage: string | ArrayBuffer | null = null;
  imagePreviews: any[] = [];

  selectedFilesList: any[] = [];
  selectedCamList: any[] = [];
  deletedImages: string[] = [];
  fileUrls: string[] = [];
  statusOptions = [{
    id:1,
    name:"Pending"
  },{
    id:3,
    name:"Solved"
  }];

  isWebCamVisible: boolean = false;
  imagesCount:number = 0;


  constructor(
    private shipService:ReturnsService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private imageService: ImageService,
    public internalService: InternalService,
    public service : FeedbackService,
    private imageCompress: NgxImageCompressService,
    private datePipe: DatePipe,
    public toastService: ToastNotificationsService,
  ){
    this.getAllSKUsData();
    this.getAllStores();
  }

  ngOnInit(): void {
    this.ordersList = this.internalService.allSkusList;
    this.queryParamsSubscription = this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      this.allItemIds = params['sku'];
      if (params['orderNumber'] && params['orderNumber'] !== 'NewOrder') {
        this.returnsTracker.orderId = params['orderId'];
        this.searchOrder(params['orderNumber']);
      }else if(params['orderNumber'] === 'NewOrder'){
        this.returnsTracker.outSideShipStation = true;
        this.generateUniqueId();
        this.returnsTracker.tags = 'outside_ShipStation';
        this.returnsTracker.orderType = 'NewOrder';
        this.returnsTracker.orderDate = this.getCurrentDate();
        this.returnsTracker.orderShortDate = this.getShortDate(this.returnsTracker.orderDate);
      }

      if (params['TrackeId']) {
        this.searchOrderById(params['TrackeId']);
      }
    });
    //this.triggerSnapshot();
  }

  ngOnDestroy(): void {
    if(this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  async getAllSKUsData() {
    if (!this.internalService.allSkusExist) {
      try {
        await this.service.getAllSKUs().subscribe((dataSKUS:any)=>{
          this.internalService.allSkusList = dataSKUS;
          this.internalService.allSkusExist = true;
        });
        //const dataSKUS: any = await this.service.getAllSKUs().toPromise();

      } catch (error) {
        // Handle errors here
        console.error(error);
      }
    }
  }

  storesExist:boolean=false;
  allStoresList:any[] = [];
  async getAllStores(){
    this.storesExist = false;
    await this.shipService.getAllStores().subscribe((stores:any) => {
      this.allStoresList = stores;
      this.storesExist = true;
      this.assignStoreName();
    });
  }

  searchOrderById(trackId:any){
    this.shipService.getOrderByTrackNumber(trackId).subscribe((data:any) => {
      this.setEditFromByItems(data[0]);

    });
  }

  orderDataExist:boolean = false;

  searchOrder(orderNumber:number) {
    this.orderDataExist = false;
    this.shipService.getOrderByOrderNumber(orderNumber).subscribe({
      next:(data)=>{
        const processedOrders = data.orders
        .filter((order:any) => order.orderNumber === orderNumber)
        .map((order:any) => {
          order.items = order.items.filter((item: any) => this.internalService.getInvalidSKU(FilteringSKUsModule.ReturnsTracker, item.sku));
          return order; // Return the modified order
        });

        // If there are any orders left after processing, set orderDataExist to true
        if (processedOrders.length > 0) {
            this.orderData = processedOrders;
            this.orderDataExist = true;
            this.setFromByItems(this.orderData[0]); // Assuming you're only interested in the first order
            this.assignData();
            this.assignStoreName();
        }
      },
      error:(error)=>{
        this.orderDataExist = true;
        this.orderData = [];
        console.error('There was an error!', error);
      }

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


  setFromByItems(itemData:any){
    this.returnsTracker.orderDate = itemData.orderDate;
    this.returnsTracker.orderId = itemData.orderId;
    this.returnsTracker.orderNumber = itemData.orderNumber;
    this.returnsTracker.storeId = itemData.advancedOptions.storeId;
    this.returnsTracker.storeName = itemData.advancedOptions.source;
    this.returnsTracker.customer = itemData.shipTo.name;
    this.returnsTracker.customerMail = itemData.customerEmail;
    this.returnsTracker.MIO = (itemData.items.length > 1) ? true : false;
    this.returnsTracker.country = (itemData.shipTo.country === "CA") ? true : false;
    const allIds = this.allItemIds.split(',').map(i=>Number(i));
    this.allItemsData = itemData.items.filter((item:any) => {
      if(this.allItemIds !== 'FULL-ORDER'){
        if(allIds.includes(item.orderItemId)){
          this.allSkus.push(item.sku);
          return item;
        }
      }else{
        this.allSkus.push(item.sku);
        return item;
      }
    });

  }

  assignStoreName(){

    if(this.orderDataExist && this.storesExist){
      if(this.returnsTracker.storeId){
        const matchingStore = this.allStoresList.find(store => store.storeId === this.returnsTracker.storeId);
        if (matchingStore) {
          this.returnsTracker.storeName = matchingStore.storeName;
        }
      }
    }
  }

  setEditFromByItems(itemData:any){
    this.returnsTracker.id = itemData.id;
    this.returnsTracker.orderDate = itemData.json_data?.orderDate;
    this.returnsTracker.orderId = itemData.json_data.orderId;
    this.returnsTracker.orderNumber = itemData.json_data.orderNumber;
    this.returnsTracker.storeName = itemData.json_data.storeName;
    this.returnsTracker.storeId = itemData.json_data.storeId ?? null;
    this.returnsTracker.customer = itemData.json_data.customer;
    this.returnsTracker.customerMail = itemData.json_data.customerMail;
    this.returnsTracker.MIO = itemData.json_data.MIO;
    this.returnsTracker.tags = itemData.json_data.tags;
    this.returnsTracker.skuGroup = [];
    this.returnsTracker.outSideShipStation = itemData.json_data.outSideShipStation;
    for (let eitem = 0; eitem < itemData.json_data.skuGroup.length; eitem++) {
      const skuItem = itemData.json_data.skuGroup[eitem];
      this.allSkus.push(skuItem.sku);
      this.returnsTracker.skuGroup.push({
        sku: skuItem.sku,
        qtyReturned: Number(skuItem.qtyReturned), // or parseFloat
        qtyDamaged: Number(skuItem.qtyDamaged)   // or parseFloat
      });
    }
    this.returnsTracker.comments = itemData.comments;
    this.returnsTracker.updateStatus = itemData.json_data.updateStatus;
    this.imagePreviews = (itemData.json_data.signed_file_urls) ? JSON.parse(itemData.json_data.signed_file_urls) : [];
    this.returnsTracker.fileUrls = this.fileUrls = (itemData.json_data.fileUrls) ? JSON.parse(itemData.json_data.fileUrls) : [];
    this.imagesCount = this.returnsTracker.fileUrls.length;
  }

  assignData(){
    this.returnsTracker.skuGroup = [];
    for(let item=0; item<this.allItemsData.length; item++){
      this.returnsTracker.skuGroup.push({sku:this.allItemsData[item].sku, qtyReturned:this.allItemsData[item].quantity, qtyDamaged:0});
    }
  }

  addSkuRow(){
    //this.returnsTracker.skuGroup.push({sku:'', qtyReturned:0, qtyDamaged:0});
    this.dynamicRows.push({
      sku:'',
      qtyReturned:0,
      qtyDamaged:0,
      ShowSkuSuggestion:false,
      SkusList:[]
    });
    const totalSKUCount:number = this.dynamicRows.length + this.returnsTracker.skuGroup.length;
    if(totalSKUCount > 1){
      this.returnsTracker.MIO = true;
    }else{
      this.returnsTracker.MIO = false;
    }
  }

  removeRow(index:number){
    this.dynamicRows.splice(index, 1);
    const totalSKUCount:number = this.dynamicRows.length + this.returnsTracker.skuGroup.length;
    if(totalSKUCount > 1){
      this.returnsTracker.MIO = true;
    }else{
      this.returnsTracker.MIO = false;
    }
  }

  removeExistRow(index:number){
    this.returnsTracker.skuGroup.splice(index, 1);
    const totalSKUCount:number = this.dynamicRows.length + this.returnsTracker.skuGroup.length;
    if(totalSKUCount > 1){
      this.returnsTracker.MIO = true;
    }else{
      this.returnsTracker.MIO = false;
    }
  }


  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public triggerSnapshot(): void {
    if (this.imagePreviews.length >= 4) {
      return;
    }
    this.trigger.next();
    this.isWebCamVisible = false;

    const fileContents = this.webcamImage?.imageAsDataUrl ?? null;
    if (fileContents) {
      const uniqueFilename = this.generateUniqueFilename('snapshot', 'jpg');
      const file = this.dataURLtoFile(fileContents, uniqueFilename);
      this.imagePreviews.push(fileContents);
      this.selectedFilesList.push(file);
    }
  }

  private generateUniqueFilename(prefix: string, extension: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(7);
    return `${prefix}_${timestamp}_${randomString}.${extension}`;
  }

  private dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  triggerFileInput() {
    // Trigger the file input click event
    this.previewImage = null;
    const fileInput = document.getElementById('uploadImgs') as HTMLInputElement;
    fileInput.click();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Use FileReader to read the file and set the data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result ?? null; // Set the previewImage with the data URL
      };
      reader.readAsDataURL(file);

    }
  }

  toggleCam(){
    this.previewImage = null;
    this.isWebCamVisible = !this.isWebCamVisible;
  }

  onSubmit() {
    this.dynamicRows.forEach((skuG:any) => {
      skuG.SkusList = [];
      this.returnsTracker.skuGroup.push({sku:skuG.sku, qtyReturned:skuG.qtyReturned, qtyDamaged:skuG.qtyDamaged});
    });
    this.returnsTracker.quantityReturnedInTotal = this.returnsTracker.skuGroup.reduce((total:number, skuItem) => total + Number(skuItem.qtyReturned), 0);
    this.returnsTracker.quantityDamagedInTotal = this.returnsTracker.skuGroup.reduce((total:number, skuItem) => total + (Number(skuItem.qtyDamaged) || 0), 0);
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    const jsonData = {
      'id': this.returnsTracker.id.toString(),
      "json_data":this.returnsTracker,
      "created_by":authUser.id,
      "modified_by":authUser.id,
      "status":this.returnsTracker.updateStatus.toString(),
      "comment":this.returnsTracker.comment,
      "deletedImage":JSON.stringify(this.deletedImages),
      imageUrl : null,
    }

    const formData = new FormData();
      // Append form fields
    formData.append('id', this.returnsTracker.id.toString());
    formData.append('json_data', JSON.stringify(this.returnsTracker));
    formData.append('created_by', authUser.id);
    formData.append('modified_by', authUser.id);
    formData.append('status', this.returnsTracker.updateStatus.toString());
    formData.append('comment', this.returnsTracker.comment);
    formData.append('deletedImage', JSON.stringify(this.deletedImages));
    // Append data URL directly
    for (let i = 0; i < this.selectedFilesList.length; i++) {
      const imageUrl = this.selectedFilesList[i];
      formData.append(`image{i}`, imageUrl);

    }
    // Append files
    const propertiesToRemove = ['quantityReturnedInTotal', 'quantityDamagedInTotal'];

    // Removing the specified properties
    for (const prop of propertiesToRemove) {
      if (jsonData.hasOwnProperty(prop)) {
        //delete jsonData[prop];
      }
    }

    this.internalService.returnsDetails = jsonData;
    this.shipService.submitReturns(formData).subscribe();
    if (this.internalService.editStatus) {
      this.internalService.editStatus = false;
      this.toastService.showSuccess('Success!', 'Feedback Updated Successfully.');
    } else {
      this.toastService.showSuccess('Success!', 'Feedback Inserted Successfully.');
    }
    this.router.navigate(['/returns']);
  }





  onFileSelected(event: any): void {
    if (this.imagePreviews.length >= 4) {
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

  calculateBase64SizeInMB(base64String: string): number {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const decodedData = atob(base64);
    const sizeInBytes = decodedData.length;

    // Convert bytes to megabytes
    const sizeInMB = sizeInBytes / (1024 * 1024);

    return sizeInMB;
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
    let exsitIndex = index;
    if((this.imagesCount - 1) < index){
      exsitIndex = index-this.imagesCount;
    }
    const modalRefApprove = this.modalService.open(ImagesRemoveCheckComponent);
    modalRefApprove.componentInstance.ImageData.subscribe((data: any) => {
      this.imagePreviews.splice(index, 1);
      if(this.fileUrls.length > 0 && this.fileUrls[index]){
        this.deletedImages.push(this.fileUrls[index]);
        this.fileUrls.splice(index, 1);
        this.imagesCount = this.imagesCount-1;
      }else if(this.selectedFilesList[exsitIndex]){
        this.selectedFilesList.splice(exsitIndex, 1);
      }

    });
  }


  generateUniqueId() {
    this.shipService.getUqniqOrderId().subscribe((data:any) => {
      this.returnsTracker.orderNumber = 'OSS'+data;
      this.returnsTracker.ossOrderNum = data;
    });
  }

  getCurrentDate(){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    return formattedDate;
  }

  getShortDate(dateString: string): string {
    const date = new Date(dateString);
    const shortDate = this.datePipe.transform(date, 'MM-dd-yyyy');
    return shortDate || ''; // Handle null or undefined result
  }

  autosku(event: any, index: number) {

    const value = event.target.value.trim(); // Remove leading/trailing white spaces

    if (value.length < 2) {
      this.dynamicRows[index].ShowSkuSuggestion = false;
      return;
    }

    this.dynamicRows[index].ShowSkuSuggestion = true;
    this.dynamicRows[index].SkusList = this.ordersList.filter((option: string) => option.toLowerCase().startsWith(value.toLowerCase())).sort();
    this.dynamicRows[index].ShowSkuSuggestion = (this.dynamicRows[index].SkusList.length > 0);
  }

  clearSkuList(index:number){
    this.dynamicRows[index].ShowSkuSuggestion = false;
  }

  selectedSku(sku:string, index:number){
    this.dynamicRows[index].sku = sku;
    this.dynamicRows[index].ShowSkuSuggestion = false;
  }


}
