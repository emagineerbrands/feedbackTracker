export interface CallLogForm{
  Address?: string;
  Agent?: string | number; // Use union types if a property can have multiple types
  Canada?: string;
  Comment?: string;
  Comments?: any[]; // Specify a more precise type if possible
  CustomerName?: string;
  Email?: string;
  GorgiasTicket?: string;
  LogId?: string;
  MIO?: string;
  OrderEdit_Assist?: string | number;
  PickUp?: string | number;
  ReactionLevel?: string | number;
  OrderNumber?: string;
}
