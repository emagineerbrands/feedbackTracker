export interface FeedbackSKUGroup{
  Complaint:number;
  ComplaintDropdown:any[];
  TypeOfComplaint:number;
  TypeOfComplaintDropdwon:any[];
  Errors:any;
  QtyReplaced:number;
  SKU:string;
  SKUReplaced:string;
  ShowSkuSuggestion:boolean;
  SkusList:string[];
  Solution:number;
  SolutionDropdwon:any[];
  hideBasedOnSolutionSelected:boolean;
  skuQuantity:number;
  skuQuantityTemp:number;
}
