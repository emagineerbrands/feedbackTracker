import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateRange } from '../../interface/DateRange';
import { FeedbackFilters } from '../../interface/FeedbackFilters';
import { PaginationParams } from '../../interface/PaginationParams';
import { ShortParams } from '../../interface/ShortParams';
import { environment } from 'src/environments/environment.prod';
import { APIEndpoints } from '../api-endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private cacheDuration = 24 * 60 * 60 * 1000;

  constructor(private httpClient: HttpClient) {
  }

  getTicketsOld(recordsPerPage:number, pageOffset:number, sortName:string, sortType:string, fromDate:string | null, toDate:string | null, orderNumber, status:number, complaint:string, download:boolean, agent:number, aggignee:string):Observable<any>{
    let params:string = `page_size=${recordsPerPage}&page_offset=${pageOffset}&sort_name=${sortName}&sort_type=${sortType}`;
    params += ((fromDate !== '') && (toDate !== '')) ? `&start_date=${fromDate}&end_date=${toDate}` : '';
    params += ((orderNumber != '') && (!isNaN(orderNumber) && (typeof Number(orderNumber) === 'number'))) ? `&order_number=${orderNumber}` : '';
    params += (status != 0) ? `&status=${status}` : '';
    params += (agent != 0) ? `&modified_by=${agent}` : '';
    params += (complaint != '') ? `&complaint_id=${complaint}` : '';
    params += (aggignee != '') ? `&assignee=${aggignee}` : '';
    params += (download) ? `&download=True` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getAll(params));
  }

  getTickets(data:FeedbackFilters, pagination:PaginationParams, short:ShortParams, download:boolean):Observable<any>{
    let params:string = `page_size=${pagination.RecordsPerPage}&page_offset=${pagination.PageOffset}&sort_name=${short.ShortName}&sort_type=${short.ShortType}`;
    params += ((data.DateRange.FromDate !== '') && (data.DateRange.ToDate !== '')) ? `&start_date=${data.DateRange.FromDate}&end_date=${data.DateRange.ToDate}` : '';
    params += (data.OrderNumber != '') ? `&order_number=${data.OrderNumber}` : '';
    params += (data.Status != 0) ? `&status=${data.Status}` : '';
    params += (data.Agent != 0) ? `&modified_by=${data.Agent}` : '';
    params += (data.Complaint != '') ? `&complaint_id=${data.Complaint}` : '';
    params += (data.Solution != '') ? `&solution=${data.Solution}` : '';
    params += (data.Assignee != '') ? `&assignee=${data.Assignee}` : '';
    params += (download) ? `&download=True` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getAll(params));
  }

  getTicketById(id:number){
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.byId(id));
  }

  getOrders(searchType:string, searchValue:any, oredersRowCount:number, sortBy: string){
    let finalEndppint:string = '';
    let shopifyService: string = '';
    if (searchType === 'EMAIL') {
      shopifyService = `search?email=${encodeURIComponent(searchValue)}&limit=${oredersRowCount}&order=${sortBy}`;
      finalEndppint = APIEndpoints.shopifyUrl.getByparams(shopifyService);
    } else if (searchType === 'ORDER_ID') {
        //shopifyService = `?number=${encodeURIComponent(searchValue)}`;
      shopifyService = `order_number=${searchValue}`;
      finalEndppint = APIEndpoints.logtypefeedbackUrl.getOrderNumberSearch(shopifyService);
    } else if (searchType === 'CUST_ID') {
      shopifyService = `?customer_id=${searchValue}&status=any&limit=${oredersRowCount}&order=${sortBy}`;
      finalEndppint = APIEndpoints.shopifyUrl.getByparams(shopifyService);
    }
    return this.httpClient.get(finalEndppint);
  }

  getOrdersCount(email:string){
    let shopifyService: string = `order_count?email=${encodeURIComponent(email)}`;
    return this.httpClient.get(APIEndpoints.shopifyUrl.getByparams(shopifyService));
  }

  getOrdersNew(params:any){
    let shopifyService: string = '';
    let finalEndppint:string = '';
    if (params.SearchType === 'email') {
        shopifyService = `search?email=${encodeURIComponent(params.SearchValue)}&limit=${params.PageRecords}&order=${params.OrdersType}`;
        finalEndppint = APIEndpoints.shopifyUrl.getByparams(shopifyService);
    } else if (params.SearchType === 'order') {
        shopifyService = `order_number=${encodeURIComponent(params.SearchValue)}`;
        finalEndppint = APIEndpoints.logtypefeedbackUrl.getOrderNumberSearch(shopifyService);
    } else if (params.SearchType === 'customer') {
        shopifyService = `?customer_id=${params.SearchValue}&status=any&limit=${params.PageRecords}&order=${params.OrdersType}`;
        finalEndppint = APIEndpoints.shopifyUrl.getByparams(shopifyService);
    }
    return this.httpClient.get(finalEndppint);
  }

  getOrdersByCustId(Id: number, recordCount:number, sortBy: string){
    const shopifyService: string = `?customer_id=${Id}&status=any&limit=${recordCount}&order=${sortBy}`;
    return this.httpClient.get(APIEndpoints.shopifyUrl.getByparams(shopifyService));
  }

  getOrdersByPagination(pageInfo:number, numberOfRecords:number){
    const shopifyService: string = `/orders?page_info=${pageInfo}&limit=${numberOfRecords}`;
    return this.httpClient.get(APIEndpoints.shopifyUrl.getByparams(shopifyService));
  }

  getCustomerDetailsByPhone(phone:string){
    const shopifyService: string = `admin/api/2023-04/customers.json?phone=${encodeURIComponent(phone)}`;
    return this.httpClient.get(APIEndpoints.shopifyUrl.getByparams(shopifyService));
  }

  submitFeedback(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.base, data);
  }

  getAllStaticData(): Observable<any> {
    // Retrieve the cached data and timestamp from localStorage
    const cachedData = JSON.parse(localStorage.getItem(environment.storageKey) || 'null');
    const cachedTimestamp = localStorage.getItem(`${environment.storageKey}_timestamp`) || '0';

    // Check if cached data is still valid (not outdated)

    if (cachedData !== null && (Date.now() - Number(cachedTimestamp) < this.cacheDuration)) {
      // If data is found in localStorage and not outdated, return it as an observable
      return of(cachedData);
    } else {
      // If data is not in localStorage or outdated, make an HTTP request and update the cache
      return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.staticData).pipe(
        map(data => {
          // Update the cache with the new data and timestamp
          localStorage.setItem(environment.storageKey, JSON.stringify(data));
          localStorage.setItem(`${environment.storageKey}_timestamp`, String(Date.now()));

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
    const cachedData = JSON.parse(localStorage.getItem(APIEndpoints.shopifyUrl.sku) || 'null'); // Handle possible null value

    // Check if cached data is still valid (not outdated)
    const cachedTimestamp = localStorage.getItem(`${APIEndpoints.shopifyUrl.sku}_timestamp`);

    if (cachedData !== null && cachedTimestamp && (Date.now() - Number(cachedTimestamp) < this.cacheDuration)) {
      // If data is found in localStorage and not outdated, return it as an observable
      return of(cachedData);
    } else {
      // If data is not in localStorage or outdated, make an HTTP request and update the cache
      return this.httpClient.get(APIEndpoints.shopifyUrl.sku).pipe(
        map(data => {
          // Update the cache with the new data and timestamp
          localStorage.setItem(APIEndpoints.shopifyUrl.sku, JSON.stringify(data));
          localStorage.setItem(`${APIEndpoints.shopifyUrl.sku}_timestamp`, String(Date.now()));
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
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getUserDetails);
  }

  getCachedUsersList(): Observable<any>{
    const cachedData = JSON.parse(localStorage.getItem(APIEndpoints.logtypefeedbackUrl.getUserDetails) || 'null');
    const cachedTimestamp = localStorage.getItem(`${APIEndpoints.logtypefeedbackUrl.getUserDetails}_timestamp`);
    if (cachedData !== null && cachedTimestamp && (Date.now() - Number(cachedTimestamp) < this.cacheDuration)) {
      return of(cachedData);
    }else{
      return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getUserDetails).pipe(
        map(data => {
          // Update the cache with the new data and timestamp
          localStorage.setItem(APIEndpoints.logtypefeedbackUrl.getUserDetails, JSON.stringify(data));
          localStorage.setItem(`${APIEndpoints.logtypefeedbackUrl.getUserDetails}_timestamp`, String(Date.now()));
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

  userInactivate(data){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.inactivateUser, data, { headers });
  }

  allUsersRole(){
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getRoles);
  }

  getUserAuthtication(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.userDetailsPostAuthentication, data, { headers });

  }

  insertUser(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.userDetails, data, { headers });
  }


  inactiveTicket(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.inactivateTicket, data, { headers });
  }

  assigneeCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.assigneeReport(params));
  }

  returnCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.returnCountReport(params));
  }

  sourceCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.sourceCountReport(params));
  }
  mioCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.mIOCountReport(params));
  }

  countryCountReport(data:DateRange){
    let params = ((data.FromDate !== '') && (data.ToDate !== '')) ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.canadaCountReport(params));
  }

  complaintTypeCountReport(data:any){
    let params = (data.FromDate !== '' && data.ToDate !== '') ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    params += (data.Solution !== '') ? `&solution=${data.Solution}` : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.complaintTypeCountReport(params));
  }

  complaintCountReport(data:any){
    let params = (data.FromDate !== '' && data.ToDate !== '') ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : '';
    params += (data.ComplaintType !== '') ? `&complaint_type=${data.ComplaintType}` : '';
    params += (data.Complaint !== '') ? `&complaint=${data.Complaint}` : '';
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.complaintCountReport(params));
  }
  skuCountReport(data:any){
    let params = `${(data.FromDate !== '' && data.ToDate !== '') ? `start_date=${data.FromDate}&end_date=${data.ToDate}` : ''}`;
    params += `${(data.Complaint !== '') ? `&complaint=${data.Complaint}` : ''}`;
    params += `${(data.ComplaintType !== '') ? `&complaint_type=${data.ComplaintType}` : ''}`;
    return this.httpClient.get<any[]>(APIEndpoints.logtypefeedbackUrl.skuCountReport(params));
  }


  firebaseAuthenticationConfig() {
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.getEncryptedFirebaseConfig);
  }

}
