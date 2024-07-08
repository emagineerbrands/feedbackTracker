import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIEndpoints } from '../api-endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {

  constructor(private httpClient: HttpClient) { }

  // Get Order Details From Ship Station using Order Number
  getOrderByOrderNumber(Order:number): Observable<any> {
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getShipStationOrderByOrderId(Order));
  }

  // Get All Stores From the Shipstation
  getAllStores(): Observable<any> {
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getShipStationStores);
  }

  // Submit Returns Tracker Form
  submitReturns(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.returnsDetails, data);
  }

  // Get All Return Tracker Data
  getReturnsDetails(data:any){
    let params:string = `page_size=${data.recordsPerPage}&page_offset=${data.pageOffset}&sort_name=${data.sort_name}&sort_type=${data.sort_type}`;
    params += ((data.fromDate !== '') && (data.toDate !== '')) ? `&start_date=${data.start_date}&end_date=${data.end_date}` : '';
    params += (data.order_number !== '') ? `&order_number=${data.order_number}` : '';
    params += (data.store_name !== '') ? `&store_name=${data.store_name}` : '';
    params += (data.order_id !== '') ? `&order_id=${data.order_id}` : '';
    params += ((data.total_damaged_quantity != '') && (!isNaN(data.total_damaged_quantity) && (typeof Number(data.total_damaged_quantity) === 'number'))) ? `&total_damaged_quantity=${data.total_damaged_quantity}` : '';
    params += ((data.total_returned_quantity != '') && (!isNaN(data.total_returned_quantity) && (typeof Number(data.total_returned_quantity) === 'number'))) ? `&total_returned_quantity=${data.total_returned_quantity}` : '';
    params += (data.status != 0) ? `&status=${data.status}` : '';
    params += (data.modifiedBy != 0) ? `&modified_by=${data.modifiedBy}` : '';
    params += (data.download) ? `&download=True` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.returnsDetailsbyParams(params));
  }

  // get Return Tracker data by Id
  getOrderByTrackNumber(trackId:number){
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.returnsDetailsbyId(trackId));
  }

  // get Order Id Uniqly And Dynamically Generated based on User Id and details
  getUqniqOrderId(){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getOssOrderId(authUser.id));
  }

  // Delete Ticket by Id ( Soft delete )
  deleteticket(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.inactivateReturnsTicket, data, { headers });
  }


}
