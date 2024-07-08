import { RetrunsSkuGroup } from "./returnsSkuGroup.interface";



export class Returns {
  public id: number;
  public orderId: number;
  public orderType:string;
  public orderNumber: string;
  public ossOrderNum: number;
  public customer: string;
  public customerMail: string;
  public orderDate: string;
  public orderShortDate: string;
  public storeId:Number;
  public storeName:string;
  public tags:string;
  public MIO: boolean;
  public outSideShipStation: boolean;
  public country: boolean;
  public skuGroup: RetrunsSkuGroup[];
  public quantityReturnedInTotal: number;
  public quantityDamagedInTotal: number;
  public updateStatus: number;
  public fileUrls: string[];
  public images?: File | null;
  public comment:string;
  public comments:any[];


  constructor(id:number=0, orderId:number, orderType:string, orderNumber: string, ossOrderNum:number, customer: string, customerMail:string, orderDate:string ,orderShortDate:string, storeId:number, storeName: string, tags:string, MIO:boolean, outSideShipStation:boolean, country:boolean, skuGroup:RetrunsSkuGroup[], quantityReturnedInTotal:number, quantityDamagedInTotal:number, updateStatus:number, fileUrls:string[] = [], images:null, comment:string, comments:any[]=[]) {
      this.id = id;
      this.orderId = orderId;
      this.orderType = orderType;
      this.orderNumber = orderNumber;
      this.ossOrderNum = ossOrderNum;
      this.customer = customer;
      this.customerMail = customerMail;
      this.orderDate = orderDate;
      this.orderShortDate = orderShortDate;
      this.storeId = storeId;
      this.storeName = storeName;
      this.tags = tags;
      this.MIO = MIO;
      this.outSideShipStation = outSideShipStation;
      this.country = country;
      this.skuGroup = skuGroup;
      this.quantityReturnedInTotal = quantityReturnedInTotal;
      this.quantityDamagedInTotal = quantityDamagedInTotal;
      this.updateStatus = updateStatus;
      this.fileUrls = fileUrls;
      this.images = images;
      this.comment = comment;
      this.comments = comments;
  }
}
