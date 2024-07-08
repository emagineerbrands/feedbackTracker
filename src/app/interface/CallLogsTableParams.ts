import { DateRange } from "./DateRange";

export interface CallLogsTableParams{
  SortName: String;
  OrderNumber: String;
  Download: String;
  SortType: String;
  IsAscending: boolean;
  RecordsPerPage: number;
  PageOffset: number;
  PickUp: number;
  ReactionLevel: number;
  Assisted: number;
  ModifiedBy: number;
  CustomerName:string;
  Date:DateRange;
}
