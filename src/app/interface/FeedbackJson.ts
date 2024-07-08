import { FeedbackSKUGroup } from "./FeedbackSKUGroup"

export interface FeedbackJson{
  orderId:string;
  MIO:boolean;
  order_placed_at:string;
  DeliveryGuarantee:boolean;
  DeliveryGuaranteeAgentCheck:boolean;
  Stamp1:number;
  Stamp2:number;
  Shipping:number;
  Return:boolean;
  Source:number;
  Assg:number;
  email:string;
  phone:string;
  SKU:string;
  allSKUs:string
  SKUGroup:FeedbackSKUGroup[];
  skuQuantityMap:any[];
  customer_name:string;
  customerLink: string;
  orderLink:string;
  Country:Boolean;
  fileUrls:any[];
  SourceDisable:Boolean;
  OrderUnique:string;
  CustomerId:string;
  skusEXIST:boolean;
}
