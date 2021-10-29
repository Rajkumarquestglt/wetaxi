import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment"; 
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getTripsByDriverId(dataTablesParams){
    // console.log("dataTablesParams",dataTablesParams.driverId)
    let apiUrlLink = "api/getTripsByDriverId?driverId="+dataTablesParams.driverId;
    
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
  getTripsByDriverIdPDF(dataTablesParams){
    let apiUrlLink = "api/getTripsByDriverIdPDF?driverId="+dataTablesParams.driverId;
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 


  }
  getTripsByDriverIdPdf(dataTablesParams){
    // console.log("dataTablesParams",dataTablesParams.driverId)
    let apiUrlLink = "api/getTripsByDriverId?driverId="+dataTablesParams.driverId;
    
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

  getTripsByPassengerId(dataTablesParams){
    // console.log("dataTablesParams",dataTablesParams.driverId)
    let apiUrlLink = "api/getTripsByPassengerId?passengerId="+dataTablesParams.passengerId;
    
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
  getTripsByPassengerIdExl(dataTablesParams){
    let apiUrlLink = "api/getTripsByPassengerId?passengerId="+dataTablesParams.passengerId;
    
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
  getTripsByPassengerIdPDF(dataTablesParams){
    let apiUrlLink = "api/getTripsByPassengerIdPDF?passengerId="+dataTablesParams.passengerId;
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 

  }
  getAllDriversLocation(dataTablesParams) {
    let apiUrlLink = "api/getAllDriversLocation?";
    
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
  getAllDriversLocationPdf() {
    let apiUrlLink = "api/getAllDriversLocation?";
    
    // if(dataTablesParams.search.value != "")
    // {
    //   apiUrlLink = apiUrlLink+"&search="+dataTablesParams.search.value;
    // }
    // if(dataTablesParams.order.length > 0 )
    // {
      
    //   apiUrlLink = apiUrlLink+"&columnName="+ dataTablesParams.columns[dataTablesParams.order[0].column].data;  
    //   apiUrlLink = apiUrlLink+"&orderBy="+ dataTablesParams.order[0].dir;     
    // }
    return this.http.get<any>(environment.apiUrl +apiUrlLink);
  }
  getAllPassengersLocation(dataTablesParams){
    
    let apiUrlLink = "api/getAllPassengersLocation?";
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
  getAllPassengersLocationPDF(){
    return this.http.get<any>(environment.apiUrl + "api/getAllPassengersLocationPDF");
    
  }
  getDriverLocationById(data): Observable<any>  {
    return this.http.get<any>(environment.apiUrl + "api/getDriverLocationById?id="+data.id);
  }
  getAllPassengersLocation1()  {
    let apiUrlLink = "api/getAllPassengersLocation?";
    return this.http.get<any>(environment.apiUrl +apiUrlLink);
    // return this.http.get<any>(environment.apiUrl + "api/getAllPassengersLocation");

  }
  getPassengersLocationById(data): Observable<any>{
    return this.http.get<any>(environment.apiUrl + "api/getPassengersLocationById?id="+data.id);
    
  }
}
