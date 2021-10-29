import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../src/environments/environment"; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecycleBinService {

  constructor(private http: HttpClient) {}

    // getAllRecycleBinList(){

    //   return this.http.get<any>(environment.apiUrl + "api/getAllRecycleBinList");
    // }
    getAllRecycleBinList(dataTablesParams){
      let apiUrlLink = "api/getAllRecycleBinList?";
    
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
    

    deleteRecycle(data): Observable<any>  {
      let options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: data,
        
      };
      console.log("deleteko",options)
      return this.http.delete<any>(environment.apiUrl + "api/deleteRecycle",options);

    }
    // recoverRecycle(data): Observable<any>  {
    //   let options = {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json',
    //     }),
    //     body: data,
    //   };
    //   console.log("rs",options)

    //   return this.http.post<any>(environment.apiUrl + "api/recoverRecycle",options);

    // }
    recoverRecycle(data): Observable<any>  {
      return this.http.get<any>(environment.apiUrl + "api/recoverRecycle?id="+data.id);

    }
    
   
}