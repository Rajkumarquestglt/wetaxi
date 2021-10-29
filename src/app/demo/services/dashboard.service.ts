import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  getDailyliveTripData(data: any) {
    return this.http.get<any>(environment.apiUrl + 'api/getDailyliveTripData', data);
  }
  getDailyLiveOnlineOfflineData(data: any) {
    return this.http.get<any>(environment.apiUrl + 'api/getDailyLiveOnlineOfflineData', data);
  }
  getTopIncomeReferEarnData(data: any) {
    return this.http.get<any>(environment.apiUrl + 'api/getTopIncomeReferEarnData', data);
  }
  getDevicesData(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/getDriverDetails', data);
  }
  getSourceToDownloadData(data: any) {
    return this.http.get<any>(environment.apiUrl + 'api/ getSourceToDownloadData', data);
  }
  getCancelReasonsData(data: any) {
    return this.http.get<any>(environment.apiUrl + 'api/ getCancelReasonsData', data);
  }
 
}
