import { FeedbackJson } from "./FeedbackJson";

export interface FeedbackForm{
  id:number;
  logtype:number;
  json_data:FeedbackJson;
  created_by:number;
  modified_by:number;
  status:number;
  comment:string;
};
