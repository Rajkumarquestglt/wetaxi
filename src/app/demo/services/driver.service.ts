import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs';

@Injectable()
export class DriverService {
  constructor(private http: HttpClient) { }
  getAllDriversLocationPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllDriversLocationPDF');

  }
  changeDriverStatus(data): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/changeDriverStatus",data);
  }
  ListOfAllDrivers(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/ListOfAllDrivers', data);
  }
  SendWarning(data: any) {
    return this.http.post<any>(environment.apiUrlVo + 'api/sendFreeCarWarning', data);
  }
  ConfirmFreeVehicle(data: any) {
    return this.http.post<any>(environment.apiUrlVo + 'api/confirmCarFree', data);
  }
  acceptRejectRequest(data: any){
    return this.http.post<any>(environment.apiUrlVo + 'api/acceptRejectRequest', data);
  }
 vehicleList(dataTablesParams){

    let apiUrlLink = "api/vehicleList?";
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
    return this.http.get<any>(environment.apiUrlVo + apiUrlLink);
  }
  vehicleRequestList(dataTablesParams){

    let apiUrlLink = "api/vehicleRequestList?";
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
    return this.http.get<any>(environment.apiUrlVo + apiUrlLink);
  }
  ListOfAllDriversPromoters(data: any) {
    return this.http.post<any>(environment.apiUrlPromoter + 'api/driverList', data);
  }
  ListOfAllDriversVo(data: any) {
    return this.http.get<any>(environment.apiUrlVo + 'api/driverList');
  }
  passengerListFromNotification(dataTablesParams){
    let apiUrlLink = "api/passengerListFromNotification?notificationId="+dataTablesParams.notificationId;
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
  driverListFromNotification(dataTablesParams) {
    // console.log("dataTablesParams",dataTablesParams)
  // return this.http.get<any>(environment.apiUrl + 'api/driverListFromNotification?notificationId='+data.notificationId); 

    let apiUrlLink = "api/driverListFromNotification?notificationId="+dataTablesParams.notificationId;
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
  getDriverListFromReward(dataTablesParams){
    console.log(dataTablesParams)
    let apiUrlLink = "api/getDriverListFromReward?rewardId="+dataTablesParams.rewardId;
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
  getPassengerListFromReward(dataTablesParams){
    let apiUrlLink = "api/getPassengerListFromReward?rewardId="+dataTablesParams.rewardId;
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
  getAllDriverPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllDriverPDF');

  }
  getAllCountries() {
    let data = {};
    return this.http.post<any>(environment.apiUrl + 'api/getAllCountries', data);
  }

  getAllVehicleTypes() {
    let data = {};
    return this.http.post<any>(environment.apiUrl + 'api/getAllVehicleTypes', data);
  }

  addDriver(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/addDriver', data);
  }
  // addVehicle(data: any) {
  //   console.log(data);
  //   return this.http.post<any>(environment.apiUrlVo + 'api/addVehicle', data);
  // }
  vehicle(data: any,editmode:boolean) {
    console.log(data);
    if(editmode){
      return this.http.post<any>(environment.apiUrlVo + 'api/editVehicle', data);
    } else {
      return this.http.post<any>(environment.apiUrlVo + 'api/addVehicle', data);
    }
  }
  getVehicle(data:any){
    return this.http.post<any>(environment.apiUrlVo + 'api/getVehicleById', data);
  }
  updateVehicle(data:any){
    return this.http.post<any>(environment.apiUrlVo + 'api/updateVehicle', data);
  }
  addDriverPromter(data: any) {
    return this.http.post<any>(environment.apiUrlPromoter + 'api/addDriver', data);
  }

  getDriverDetails(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/getDriverDetails', data);
  }

  editDriver(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/editDriver', data);
  }
  editDriverPromoter(data: any) {
    return this.http.post<any>(environment.apiUrlPromoter + 'api/editDriver', data);
  }
  blockUnblockDriver(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/blockUnblockDriver', data);
  }
  blockUnblockDriverPromoter(data: any) {
    return this.http.post<any>(environment.apiUrlPromoter + 'api/blockUnblockDriver', data);
  }
  verifyUnverifyDriverPromoter(data: any) {
    return this.http.post<any>(environment.apiUrlPromoter + 'api/verifyUnverifyDriver', data);
  }
  verifyUnverifyDriver(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/verifyUnverifyDriver', data);
  }
  deleteDriver(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/deleteDriver', data);
  }

  getAllBillingPlans() {
    let data = {};
    return this.http.post<any>(environment.apiUrl + 'api/listAllBillingPlans', data);
  }

  updateBillingPlan(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/updateBillingPlan', data);
  }

  
}