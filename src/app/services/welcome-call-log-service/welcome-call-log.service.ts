import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIEndpoints } from '../api-endpoints/api-endpoints';
import { DateRange } from '../../interface/DateRange';

@Injectable({
  providedIn: 'root'
})
export class WelcomeCallLogService {

  constructor(private httpClient: HttpClient) { }

  // Get All Wellcome Logs Data

  callLogs(pagination: any) {
    const params: string[] = [];

    if (pagination.RecordsPerPage) params.push(`page_size=${pagination.RecordsPerPage}`);
    if (pagination.RecordsPerPage) params.push(`page_offset=${pagination.PageOffset}`);
    if (pagination.SortName) params.push(`sortName=${pagination.SortName}`);
    if (pagination.SortType) params.push(`sortType=${pagination.SortType}`);
    if ((pagination.Date.FromDate !== '') && (pagination.Date.ToDate !== '')) params.push(`start_date=${pagination.Date.FromDate}&end_date=${pagination.Date.ToDate}`);
    if (pagination.Download === 'True') params.push(`download=True`);
    if (pagination.CustomerName) params.push(`name=${pagination.CustomerName}`);
    if (pagination.OrderNumber) params.push(`order_number=${pagination.OrderNumber}`);
    if (pagination.PickUp !== 0) params.push(`pick_up=${pagination.PickUp}`);
    if (pagination.ReactionLevel !== 0) params.push(`reaction_level=${pagination.ReactionLevel}`);
    if (pagination.Assisted !== 0) params.push(`assisted=${pagination.Assisted}`);
    if (pagination.ModifiedBy !== 0) params.push(`modified_by=${pagination.ModifiedBy}`);

    // Creating the final URL
    const finalUrl = `${APIEndpoints.logtypefeedbackUrl.welcomeLogCallsDetails}?${params.join('&')}`;
    // Assuming you're making an HTTP GET request
    return this.httpClient.get<any[]>(finalUrl);
  }


  // Get Welcome Log Data By Id
  callLogsById(id:number){
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.welcomeLogCallsDetailsbyId(id));
  }

  // Submit Call Log Form Data
  submitCallLogs(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.welcomeLogCallsDetails, data);
  }

  getVolumeCallsCount(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.welcomeLogsVollumeCallCountByParams(params));
  }

  getDistributionCallsCount(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.distributionOfCallsReport(params));
  }

  getEngagementLevelCallsCount(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.engagementLevelsOfCallsReport(params));
  }

  getEngagementCallsPerProductCount(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.sKUBasedEngagementLevelsOfCallsReport(params));
  }
  getPickedUpCallsPerProductCount(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.sKUBasedPickedUpCallsReport(params));
  }
}
