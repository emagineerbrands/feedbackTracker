import { Complaint } from "./complaint.interface";
import { Complaints } from "./complaints.interface";
import { SKUGroupErrors } from "./skuGroupErrors.interface";
import { Solutions } from "./solutions.interface";

export interface SKUGroup {
  SKU:string;
  ComplaintId: number;
  Complaint: number;
  ComplaintDropdown: Complaints[];
  TypeOfComplaint:number;
  TypeOfComplaintDropdwon: Complaint[];
  Solution:number;
  SolutionDropdwon: Solutions[];
  QtyReplaced: number;
  skuQuantity: number;
  skuQuantityTemp: number;
  SKUReplaced: string;
  ShowSkuSuggestion: boolean;
  hideBasedOnSolutionSelected: boolean;
  SkusList: string[];
  Errors: SKUGroupErrors;
}
