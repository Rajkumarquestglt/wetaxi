import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class ActionLogsService {

  constructor(private http: HttpClient) { }

  ListOfallActionLog(data: any) {
    return this.http.post<any>(environment.apiUrl + 'api/ListOfAllActionLog', data);
  }
  getAllActionLogPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllActionLogPDF');

  }
  getAllActionLogCSV(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllActionLogCSV');

  }
  getAllActionLogByUserIdPDF(data){
    return this.http.get<any>(environment.apiUrl + 'api/getAllActionLogByUserIdPDF?userId='+data.userId);

  }
  getAllActionLogByUserIdExl(data){
    console.log("data",data)
    return this.http.get<any>(environment.apiUrl + 'api/getAllActionLogByUserId?userId='+data);

  }
  getAllActionLogByUserId(dataTablesParams){
    // console.log("dataTablesParams",dataTablesParams.driverId)
    let apiUrlLink = "api/getAllActionLogByUserId?userId="+dataTablesParams.userId;
    
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
}
