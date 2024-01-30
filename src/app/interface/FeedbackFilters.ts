import { DateRange } from "./DateRange";

export interface FeedbackFilters{
  OrderNumber:string;
  Agent:number;
  DateRange:DateRange;
  Complaint:string;
  Assignee:string;
  Status:number;
}
