import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment"; 
import { forEach } from '@angular/router/src/utils/collection';
import { dataLoader } from '@amcharts/amcharts4/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionCodeService {

  constructor(private http: HttpClient) { }
  getPromotionList(dataTablesParams){
    let apiUrlLink = "api/getPromotionList?startDate=01-01-1990&endDate=31-12-2020";
    if(dataTablesParams.search.value != "")
    {
      apiUrlLink = apiUrlLink+"&search="+dataTablesParams.search.value;
    }
    if(dataTablesParams.order.length > 0 )
    {
      apiUrlLink = apiUrlLink+"&columnName="+ dataTablesParams.columns[dataTablesParams.order[0].column].data;  
      apiUrlLink = apiUrlLink+"&orderBy="+ dataTablesParams.order[0].dir;     
    }
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 
  }
  getPromotionListExport(){
    let apiUrlLink = "api/getPromotionList?startDate=01-01-1990&endDate=31-12-2020";
    return this.http.get<any>(environment.apiUrl + apiUrlLink); 

  }
  // getAllReceivedBookingsDispacterPDF(){
  //   return this.http.get<any>(environment.apiUrl + 'api/getAllReceivedBookingsDispacterPDF'); 

  // }
  getPromotionListPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getPromotionListPDF'); 

  }
  getPromoCodeDetailsById(data){
    return this.http.get<any>(environment.apiUrl + 'api/getPromoCodeDetailsById?id='+data); 

  }
  deletePromotionCode(data): Observable<any>  {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
      
    };
    // console.log("data-------------",data)
    // console.log("deleteko",options)
    return this.http.delete<any>(environment.apiUrl + "api/deletePromotionCode",options);

  }
}
