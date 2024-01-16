import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReturnsService {

  private apiEndpoint = 'https://ssapi.shipstation.com/';
  private apiKey = '4c5f4c557c624ee5a65aba9a1e6f61de';
  private apiSecret = '8a5dda46cbbb4a08863c493587b4a90c';
  private url = "https://us-central1-sails-development.cloudfunctions.net/LogTypeFeedbackDetails/"
  //private url = 'https://us-central1-copper-imprint-246119.cloudfunctions.net/LogTypeFeedbackDetails/';

  apiString:string = '4c5f4c557c624ee5a65aba9a1e6f61de:8a5dda46cbbb4a08863c493587b4a90c'

  constructor(private httpClient: HttpClient) { }



  getCustomerNameByOrderId(Order:number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.apiKey}:${this.apiSecret}`));

    //const params = new HttpParams().set('orderId', orderId);

    return this.httpClient.get(`${this.apiEndpoint}orders?orderNumber=${Order}`, { headers: headers });
    // Replace 'getcustomername' with the appropriate ShipStation API endpoint for retrieving customer information by order ID
  }

  getOrderByOrderNumber(Order:number): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', 'Basic ' + btoa(`${this.apiKey}:${this.apiSecret}`));
    return this.httpClient.get(`${this.apiEndpoint}orders?orderNumber=${Order}`, { headers: headers });
  }


  submitReturns(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.httpClient.post<any>(this.url+'ReturnsDetails', data);
  }

  getReturnsDetails(data:any){
    let params:string = 'page_size='+data.recordsPerPage+'&page_offset='+data.pageOffset+'&sort_name='+data.sort_name+'&sort_type='+data.sort_type;;
    params += ((data.fromDate !== '') && (data.toDate !== '')) ? '&start_date='+data.start_date+'&end_date='+data.end_date : '';
    params += (data.order_number !== '') ? '&order_number='+data.order_number : '';
    params += (data.order_id !== '') ? '&order_id='+data.order_id : '';
    params += ((data.total_damaged_quantity != '') && (!isNaN(data.total_damaged_quantity) && (typeof Number(data.total_damaged_quantity) === 'number'))) ? '&total_damaged_quantity='+data.total_damaged_quantity : '';
    params += ((data.total_returned_quantity != '') && (!isNaN(data.total_returned_quantity) && (typeof Number(data.total_returned_quantity) === 'number'))) ? '&total_returned_quantity='+data.total_returned_quantity : '';
    params += (data.status != 0) ? '&status='+data.status : '';
    params += (data.modifiedBy != 0) ? '&modified_by='+data.modifiedBy : '';
    params += (data.download) ? '&download=True' : '';
    return this.httpClient.get( this.url+'ReturnsDetails?'+params);
  }

  getOrderByTrackNumber(trackId:number){
    return this.httpClient.get( this.url+'ReturnsDetails/'+trackId);
  }

  getUqniqOrderId(){
    const authUser = JSON.parse(localStorage.getItem('authDetails') || 'null');
    return this.httpClient.get( this.url+'GetOssOrderId?user_id='+authUser.id);
  }

  deleteticket(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.url+'InactivateReturnsTicket', data, { headers });
  }
}
