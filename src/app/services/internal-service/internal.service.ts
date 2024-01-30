import { Injectable } from '@angular/core';
import { StaticDropdown } from '../../interface/StaticDropdown';
import { User } from '../../interface/User';

@Injectable({
  providedIn: 'root'
})
export class InternalService {


  userDetails!:User;


  dropdownData:StaticDropdown = { StampOne:[], StampTwo:[], Solutions:[], Shipping:[], Source:[], Assignee:[], TicketStatus:[], Complaint:[], ComplaintType:[] };
  dropdownDataExist:boolean = false;

  constructor() { }

  //Feedback Data After Form Submission Return To Feedback List Page
  feedbackUpdatePage:boolean = false;
  feedbackFormId:number = 0;
  feedbackformPayloadData:any;
}
