import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';
@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(private http: HttpClient) { }

  SendNotificationToDriver(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/sendNotificationToDriver', data);
  }
  sendNotificationToDriverList(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/sendNotificationToDriverList', data);
  }
  sendRewardToDriverList(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/sendRewardToDriverList', data);

  }
  sendRewardToPassengerList(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/sendRewardToPassengerList', data);

  }
  sendNotificationToPassengerList(data :any){
    return this.http.post<any>(environment.apiUrl + 'api/sendNotificationToPassengerList', data);

  }
  // SendNotificationToPassenger(data: any) {
  //   return this.http.post<any>(environment.apiUrl + 'api/sendNotificationToPassenger', data);
  // } 
  getNotificationDetails(data){
    return this.http.get<any>(environment.apiUrl + 'api/getNotificationDetails?notificationId='+data); 

  }
  getRewardDetails(data){
    console.log(data)
    return this.http.get<any>(environment.apiUrl + 'api/getRewardDetails?rewardId='+data); 

  }
  changePassword(data: any) {
    
    return this.http.post<any>(environment.apiUrl + 'api/changePassword', data);
  }
  getAllNotificationListPDF(){
    let apiUrlLink = "api/getAllNotificationListPDF?";
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 

  }
  getAllNotification(dataTablesParams){
    console.log(dataTablesParams)
    let apiUrlLink = "api/getAllNotification?";
    // if(dataTablesParams.search.value != "")
    {
      apiUrlLink = apiUrlLink+"search="+dataTablesParams.search.value;
    }
    if(dataTablesParams.start != "")
    {
      apiUrlLink = apiUrlLink+"&skip="+dataTablesParams.start;
    }
    if(dataTablesParams.length != "")
    {
      apiUrlLink = apiUrlLink+"&limit="+dataTablesParams.length;
    }
    if(dataTablesParams.order.length > 0 )
    {
      apiUrlLink = apiUrlLink+"&columnName="+ dataTablesParams.columns[dataTablesParams.order[0].column].data;  
      apiUrlLink = apiUrlLink+"&orderBy="+ dataTablesParams.order[0].dir;     
    }
    if(dataTablesParams.filter.fromDate && dataTablesParams.filter.toDate){
      apiUrlLink += "&startDate="+dataTablesParams.filter.fromDate;
      apiUrlLink += "&endDate="+dataTablesParams.filter.toDate;
    }
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 
  }
  getAllRewardList(dataTablesParams){
    let apiUrlLink = "api/getAllRewardList?";
    if(dataTablesParams.search.value != "")
    {
      apiUrlLink = apiUrlLink+"&search="+dataTablesParams.search.value;
    }
    if(dataTablesParams.start != "")
    {
      apiUrlLink = apiUrlLink+"&skip="+dataTablesParams.start;
    }
    if(dataTablesParams.length != "")
    {
      apiUrlLink = apiUrlLink+"&limit="+dataTablesParams.length;
    }
    if(dataTablesParams.order.length > 0 )
    {
      apiUrlLink = apiUrlLink+"&columnName="+ dataTablesParams.columns[dataTablesParams.order[0].column].data;  
      apiUrlLink = apiUrlLink+"&orderBy="+ dataTablesParams.order[0].dir;     
    }
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 
  }
  getAllRewardListPDF(){
    let apiUrlLink = "api/getAllRewardListPDF?";
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 
  }
  getAllRewardList1(){
    let apiUrlLink = "api/getAllRewardList?";
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 
  }
  getAllNotification1(){
    // console.log(dataTablesParams)
    let apiUrlLink = "api/getAllNotification?";
    // if(dataTablesParams.search.value != "")
    // {
    //   apiUrlLink = apiUrlLink+"&search="+dataTablesParams.search.value;
    // }
    // if(dataTablesParams.order.length > 0 )
    // {
    //   apiUrlLink = apiUrlLink+"&columnName="+ dataTablesParams.columns[dataTablesParams.order[0].column].data;  
    //   apiUrlLink = apiUrlLink+"&orderBy="+ dataTablesParams.order[0].dir;     
    // }
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 
  }
  ListOfAllNotificationLogs(data: any) {
     let apiUrlLink = 'api/ListOfAllNotificationLogs?';
    if(data.search.value != "")
    {
      apiUrlLink = apiUrlLink+"&search="+data.search.value;
    }
    if(data.order.length > 0 )
    {
      
      apiUrlLink = apiUrlLink+"&columnName="+ data.columns[data.order[0].column].data;  
      apiUrlLink = apiUrlLink+"&orderBy="+ data.order[0].dir;     
    }
    return this.http.post<any>(environment.apiUrl + apiUrlLink , {});
  }
  createNotification(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/createNotification', data);

  }
  createReward(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/createReward', data);

  }
  updateNotification(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/updateNotification', data);
  }
  updateReward(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/updateReward', data);
    
  }
  getNotificationLogsUserList(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/getNotificationLogsUserList', data);
  }

  sendNotificationFromNotificationLogs(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/sendNotificationFromNotificationLogs', data);
  }

}
