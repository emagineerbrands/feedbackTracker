import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateRange } from '../../interface/DateRange';
import { FeedbackFilters } from '../../interface/FeedbackFilters';
import { PaginationParams } from '../../interface/PaginationParams';
import { ShortParams } from '../../interface/ShortParams';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private logtypefeedbackUrl:string = 'https://us-central1-sails-development.cloudfunctions.net/LogTypeFeedbackDetails';
  //private logtypefeedbackUrl:string = 'https://us-central1-copper-imprint-246119.cloudfunctions.net/LogTypeFeedbackDetails';
  private shopifyUrl:string = 'https://us-central1-sails-development.cloudfunctions.net/ShopifyOrderService';
  //private shopifyUrl:string = 'https://us-central1-copper-imprint-246119.cloudfunctions.net/ShopifyOrderService';
  storageKey:string = 'staticData';
  constructor(private httpClient: HttpClient) {
  }

  getTickets(data:FeedbackFilters, pagination:PaginationParams, short:ShortParams, download:boolean):Observable<any>{
    let params:string = 'page_size='+pagination.RecordsPerPage+'&page_offset='+pagination.PageOffset+'&sort_name='+short.ShortName+'&sort_type='+short.ShortType;
    params += ((data.DateRange.FromDate !== '') && (data.DateRange.ToDate !== '')) ? '&start_date='+data.DateRange.FromDate+'&end_date='+data.DateRange.ToDate : '';
    params += (data.OrderNumber != '') ? '&order_number='+data.OrderNumber : '';
    params += (data.Status != 0) ? '&status='+data.Status : '';
    params += (data.Agent != 0) ? '&modified_by='+data.Agent : '';
    params += (data.Complaint != '') ? '&complaint_id='+data.Complaint : '';
    params += (data.Assignee != '') ? '&assignee='+data.Assignee : '';
    params += (download) ? '&download=True' : '';
    return this.httpClient.get( this.logtypefeedbackUrl+'/FeedBackDetails?'+params);
  }

  getTicketById(id:number){
    return this.httpClient.get( this.logtypefeedbackUrl+'/FeedBackDetails/'+id);
  }

  getOrders(searchType:string, searchValue:any, oredersRowCount:number, sortBy: string){
    let shopifyService:string = '';
    if(searchType === 'EMAIL'){
      shopifyService = '/search?email='+encodeURIComponent(searchValue)+'&limit='+oredersRowCount+'&order='+sortBy;
    }else if( searchType === 'ORDER_ID'){
      shopifyService = '?number='+encodeURIComponent(searchValue);
    }else if(searchType === 'CUST_ID'){
      shopifyService = "?customer_id="+searchValue+'&status=any&limit='+oredersRowCount+'&order='+sortBy;
    }
    return this.httpClient.get(this.shopifyUrl+shopifyService);
  }

  getOrdersCount(email:string){
    let shopifyService:string = '';
    shopifyService = '/order_count?email='+encodeURIComponent(email);
    return this.httpClient.get(this.shopifyUrl+shopifyService);
  }

  getOrdersByCustId(Id: number, recordCount:number, sortBy: string){
    return this.httpClient.get(this.shopifyUrl+"?customer_id="+Id+'&status=any&limit='+recordCount+'&order='+sortBy);
  }

  getOrdersByPagination(pageInfo:number, numberOfRecords:number){
    let shopifyService:string = '';
    shopifyService = '/orders?page_info='+pageInfo+'&limit='+numberOfRecords;
    return this.httpClient.get(this.shopifyUrl+shopifyService);
  }

  getCustomerDetailsByPhone(phone:string){
    return this.httpClient.get(this.shopifyUrl+"/admin/api/2023-04/customers.json?phone="+encodeURIComponent(phone));
  }

  submitFeedback(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.httpClient.post<any>(this.logtypefeedbackUrl+'/FeedBackDetails', data);
  }

  getAllStaticData(): Observable<any> {
    const url = `${this.logtypefeedbackUrl}/GetStaticData`;
    // Retrieve the cached data and timestamp from localStorage
    const cachedData = JSON.parse(localStorage.getItem(this.storageKey) || 'null');
    const cachedTimestamp = localStorage.getItem(`${this.storageKey}_timestamp`) || '0';

    // Check if cached data is still valid (not outdated)
    const cacheExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    //const cacheExpirationTime = 0; // 24 hours in milliseconds

    if (cachedData !== null && (Date.now() - Number(cachedTimestamp) < cacheExpirationTime)) {
      // If data is found in localStorage and not outdated, return it as an observable
      return of(cachedData);
    } else {
      // If data is not in localStorage or outdated, make an HTTP request and update the cache
      return this.httpClient.get(url).pipe(
        map(data => {
          // Update the cache with the new data and timestamp
          localStorage.setItem(this.storageKey, JSON.stringify(data));
          localStorage.setItem(`${this.storageKey}_timestamp`, String(Date.now()));
          return data;
        }),
        catchError(error => {
          // Handle errors here if needed
          console.error('Error fetching data:', error);
          throw error;
        })
      );
    }
  }

  getAllSKUs(): Observable<any> {
    const skuUrl = `${this.shopifyUrl}/SKU`;
    const cachedData = JSON.parse(localStorage.getItem(skuUrl) || 'null'); // Handle possible null value

    // Check if cached data is still valid (not outdated)
    const cachedTimestamp = localStorage.getItem(`${skuUrl}_timestamp`);
    const cacheExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (cachedData !== null && cachedTimestamp && (Date.now() - Number(cachedTimestamp) < cacheExpirationTime)) {
      // If data is found in localStorage and not outdated, return it as an observable
      return of(cachedData);
    } else {
      // If data is not in localStorage or outdated, make an HTTP request and update the cache
      return this.httpClient.get(skuUrl).pipe(
        map(data => {
          // Update the cache with the new data and timestamp
          localStorage.setItem(skuUrl, JSON.stringify(data));
          localStorage.setItem(`${skuUrl}_timestamp`, String(Date.now()));
          return data;
        }),
        catchError(error => {
          // Handle errors here if needed
          console.error('Error fetching data:', error);
          throw error;
        })
      );
    }
  }

  allUsersList(){
    return this.httpClient.get(this.logtypefeedbackUrl+"/GetUserDetails");
  }

  allUsersRole(){
    return this.httpClient.get(this.logtypefeedbackUrl+"/GetRoles");
  }

  getUserAuthtication(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.logtypefeedbackUrl+'/UserDetailsPostAuthentication', data, { headers });

  }

  insertUser(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.logtypefeedbackUrl+'/UserDetails', data, { headers });
  }


  inactiveTicket(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(this.logtypefeedbackUrl+'/InactivateTicket', data, { headers });
  }

  assigneeCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/AssigneeReport?"+params);
  }

  returnCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/ReturnCountReport?"+params);
  }

  sourceCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/SourceCountReport?"+params);
  }
  mioCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/MIOCountReport?"+params);
  }

  countryCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/CanadaCountReport?"+params);
  }

  complaintTypeCountReport(data:any){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    params += (data.Solution !== '') ? 'solution='+data.Solution : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/ComplaintTypeCountReport?"+params);
  }

  complaintCountReport(data:any){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    params += (data.ComplaintType !== '') ? 'complaint_type='+data.ComplaintType : '';
    params += (data.Complaint !== '') ? '&complaint='+data.Complaint : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/ComplaintCountReport?"+params);
  }
  skuCountReport(data:any){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? 'start_date='+data.FromDate+'&end_date='+data.ToDate : '';
    params += (data.Complaint !== '') ? '&complaint='+data.Complaint : '';
    params += (data.ComplaintType !== '') ? 'complaint_type='+data.ComplaintType : '';
    return this.httpClient.get(this.logtypefeedbackUrl+"/SkuCountReport?"+params);
  }

}
