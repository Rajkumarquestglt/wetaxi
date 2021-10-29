import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs';

@Injectable()
export class BillingPlanService {
  
  constructor(private http: HttpClient) { }

  listAllBillingPlans(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/listAllBillingPlans', data);
  }

  getBillingPlanDetails(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/getBillingPlanDetails', data);
  }

  editBillingPlan(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/editBillingPlan', data);
  }
  saveBillingPlan(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/saveBillingPlan', data);

  }
  getAllBillingPlansPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllBillingPlansPDF');

  }
  deleteBillingPlan(data): Observable<any>  {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
      
    };
    console.log("deleteko",options)
    return this.http.delete<any>(environment.apiUrl + "api/deleteBillingPlan",options);
  }
}