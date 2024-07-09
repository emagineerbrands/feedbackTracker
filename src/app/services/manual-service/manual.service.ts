import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { APIEndpoints } from '../api-endpoints/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ManualService {

  constructor(private httpClient: HttpClient) { }

  getAllManuals(){
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.userManuls.manuals);
  }

  submitManual(data:any){
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.userManuls.manuals, data);
  }

  getManual(id:number){
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.userManuls.getManual(id));
  }

  deleteManual(data:any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post<any>(APIEndpoints.logtypefeedbackUrl.userManuls.deletemanual, data, { headers });
  }

  updateManualPermission(data:any){
    let params:string = '';
    params += (data.FileId != '') ? `&file_id=${data.FileId}` : '';
    params += (data.Email != 0) ? `&email=${data.Email}` : '';
    return this.httpClient.get(APIEndpoints.logtypefeedbackUrl.userManuls.userManualPermission(params));
  }

}
