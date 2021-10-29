import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map'; 
import { Observable } from 'rxjs';

@Injectable()
export class OperatorService {
  
  constructor(private http: HttpClient) { }
  editPromotionCode(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/editPromotionCode', data);

  }

  getUserById(data){
    return this.http.get<any>(environment.apiUrl + 'api/getUserById?id='+data); 

  }

  editUser(data:any){
console.log("editUser",data)
    return this.http.post<any>(environment.apiUrl + 'api/editUser',data); 

  }
  getAllPages(){
     return this.http.get<any>(environment.apiUrl + 'api/getAllPages');

  }
  getUserGroupById(data){
    return this.http.get<any>(environment.apiUrl + 'api/getUserGroupById?id='+data); 
  }
  // listAllOperators(data: any) {
  //   return this.http.post<any>(environment.apiUrl + 'api/listAllOperators', data);
  // }
  listAllOperators(dataTablesParams) {
    // return this.http.get<any>(environment.apiUrl + 'api/listPromoter', data);
    let apiUrlLink = "api/listPromoter?";
    {
      apiUrlLink = apiUrlLink+"&searchKey="+dataTablesParams.search.value;
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
    return this.http.get<any>(environment.apiUrl +apiUrlLink);
  }
  listAllVehicleOwner(dataTablesParams) {
    // listAllVehicleOwnerPromoter(dataTablesParams) {
    // return this.http.get<any>(environment.apiUrl + 'api/listPromoter', data);
    let adminData = JSON.parse(localStorage.getItem("adminData"));

    let apiUrlLink = "api/vehicleOwnerList?";
    
    {
      apiUrlLink = apiUrlLink+"searchKey="+dataTablesParams.search.value;
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
    if(adminData.type == "promoter"){
      return this.http.get<any>(environment.apiUrlPromoter +apiUrlLink);
    }else{
    return this.http.get<any>(environment.apiUrl +apiUrlLink);
    }
  }
  // listAllVehicleOwner(dataTablesParams) {
  //   // return this.http.get<any>(environment.apiUrl + 'api/listPromoter', dataTablesParams);
  //   let apiUrlLink = "api/vehicleOwnerList?";
    
  //   {
  //     apiUrlLink = apiUrlLink+"searchKey="+dataTablesParams.search.value;
  //   }
  //   if(dataTablesParams.start != "")
  //   {
  //     apiUrlLink = apiUrlLink+"&skip="+dataTablesParams.start;
  //   }
  //   if(dataTablesParams.length != "")
  //   {
  //     apiUrlLink = apiUrlLink+"&limit="+dataTablesParams.length;
  //   }
  //   if(dataTablesParams.order.length > 0 )
  //   {
  //     apiUrlLink = apiUrlLink+"&columnName="+ dataTablesParams.columns[dataTablesParams.order[0].column].data;  
  //     apiUrlLink = apiUrlLink+"&orderBy="+ dataTablesParams.order[0].dir;     
  //   }
  //   return this.http.get<any>(environment.apiUrl +apiUrlLink);
  // }
  GetAllPosition(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllPositionNew');
}
savePromoCode(data: any){
  return this.http.post<any>(environment.apiUrl + 'api/savePromoCode',data);

}
  deleteUser(data): Observable<any> {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete<any>(environment.apiUrl + "api/deleteUser",options);

  }
  changeUserStatus(data): Observable<any> {
    // let options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   }),
    //   body: data,
    // };
    return this.http.post<any>(environment.apiUrl + "api/changeUserStatus",data);
  }
  changeUserGroupsStatus(data): Observable<any>{
    return this.http.post<any>(environment.apiUrl + "api/changeUserGroupsStatus",data);
  }

  deleteUserGroups(data): Observable<any> {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete<any>(environment.apiUrl + "api/deleteUserGroups",options);

  }
  // addOperator(data: any) {
  //   return this.http.post<any>(environment.apiUrl + 'api/addOperator', data);
  // }
  addOperator(data:any){
    let input = new FormData();
    input.append('countryCode', data.countryCode);
    input.append('dob', data.dob);
    input.append('email', data.email);
    input.append('name', data.name);
    input.append('password', data.password);
    input.append('userType', data.userType);
    input.append('phoneNumber', data.onlyPhoneNumber);
    input.append('Commission', data.Commission);
    return this.http.post<any>(environment.apiUrl + 'api/addVehicleOwner', input);
  }
  addOperatorPromoter(data){
    let input = new FormData();
    input.append('countryCode', data.countryCode);
    input.append('dob', data.dob);
    input.append('email', data.email);
    input.append('name', data.name);
    input.append('password', data.password);
    input.append('userType', data.userType);
    input.append('phoneNumber', data.onlyPhoneNumber);
    input.append('Commission', data.Commission);


      return this.http.post<any>(environment.apiUrlPromoter + 'api/addVehicleOwner', input);
  }
  saveUser(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/saveUser', data);

  }
  saveUserGroups(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/saveUserGroups', data);

  }
  editUserGroups(data: any){
    return this.http.post<any>(environment.apiUrl + 'api/editUserGroups', data);
  }
  changePasswordStatus(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/changePasswordStatus', data);
  }

  // getOperatorDetails(data: any) {
  //   return this.http.post<any>(environment.apiUrl + 'api/getOperatorDetails', data);
  // }
  getOperatorDetails(data) {
    // console.log("data",data)
    return this.http.get<any>(environment.apiUrl + 'api/vehicleOwnerDetails?id='+data);
  }
  // editOperator(data: any) {
  //   return this.http.post<any>(environment.apiUrl + 'api/editOperator', data);
  // }
  editOperator(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/editVehicleOwner', data);
  }
  editVehicleOwner(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/editVehicleOwner', data);
  }
  editVehicleOwnerPromoter(data: any) {
    return this.http.post<any>(environment.apiUrlPromoter + 'api/editVehicleOwner', data);
  }

  // activeInactiveOperator(data: any) {
  //   return this.http.post<any>(environment.apiUrl + 'api/activeInactiveOperator', data);
  // }

  activeInactiveOperator(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/deactivatePromoter', data);
  }
  deleteOperator(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/deleteOperator', data);
  }
  getAllUsers1(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllUsers');

  }
  getAllUsers(dataTablesParams){
    let apiUrlLink = "api/getAllUsers?";
    
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
    return this.http.get<any>(environment.apiUrl +apiUrlLink);
  }

  getAllUserGroups1(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllUserGroups');

  }
  getAllUserGroups(dataTablesParams){
    let apiUrlLink = "api/getAllUserGroups?";
    
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
    return this.http.get<any>(environment.apiUrl +apiUrlLink);
  }
  getAllUserGroupsPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllUserGroupsPDF');

  }
  getAllUsersPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllUsersPDF');

  }
}