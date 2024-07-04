export interface OrderIssueTrackerOrderSearch{
  SearchType:string;
  SearchValue:string;
  OrdersType:string;
  PageRecords:number;
  OrdersCount:number;
  OrdersExist:boolean;
  Orders:any[];
  PreviousURL:string;
  NextURL:string;
  CurrentPage:string;
  CustomersExist:boolean;
  Customers:any[];
  selectedRowIndex:number;
  isSortEnable : boolean;
  DataSearched : boolean;
}
