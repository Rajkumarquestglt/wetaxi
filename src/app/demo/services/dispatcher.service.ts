import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment"; 

@Injectable({
  providedIn: "root"
})
export class DispatcherService {
  constructor(private http: HttpClient) {}

  getAllReceivedBookingsDispacter1() {
    return this.http.get<any>(
      environment.apiUrl + "api/getAllReceivedBookingsDispacter"
    );
  }
  getAllReceivedBookingsDispacter(dataTablesParams){
    // console.log("dataTablesParams",dataTablesParams)
    let apiUrlLink = "api/getAllReceivedBookingsDispacter?";
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
  getAllOnRideDispacter(dataTablesParams) {
    let apiUrlLink = "api/getAllOnRideDispacter?";
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
  getAllAcceptedBookingdDispacter(dataTablesParams) {
    let apiUrlLink = "api/getAllAcceptedBookingdDispacter?";
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
  // getAllReceivedBookingsDispacterPDF(){
  //   return this.http.get<any>(
  //     environment.apiUrl + "api/getAllReceivedBookingsDispacterPDF"
  //   ); 
  // }
  getMonthlyReceivedBookingsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getMonthlyReceivedBookingsCount"
    );
  }
  getWeeklyReceivedBookingsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getWeeklyReceivedBookingsCount"
    );
  }
  getAllAcceptedBookingdDispacter1() {
    return this.http.get<any>(
      environment.apiUrl + "api/getAllAcceptedBookingdDispacter"
    );
  }
  getMonthlyAcceptedBookingsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getMonthlyAcceptedBookingsCount"
    );
  }
  getWeeklyAcceptedBookingsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getWeeklyAcceptedBookingsCount"
    );
  }
  getAllOnRideDispacter1() {
    return this.http.get<any>(environment.apiUrl + "api/getAllOnRideDispacter");
  }
  getMonthlyAcceptedOnRideDispacterCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getMonthlyAcceptedOnRideDispacterCount"
    );
  }
  getWeeklyAcceptedOnRideDispacterCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getWeeklyAcceptedOnRideDispacterCount"
    );
  }
  getAllSuccessfulTripsDispacter1() {
    return this.http.get<any>(
      environment.apiUrl + "api/getAllSuccessfulTripsDispacter"
    );
  }
  getAllSuccessfulTripsDispacter(dataTablesParams) {
    // console.log("dataTablesParams",dataTablesParams)
    let apiUrlLink = "api/getAllSuccessfulTripsDispacter?";
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
  getMonthlySuccessfulTripsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getMonthlySuccessfulTripsCount"
    );
  }
  getWeeklySuccessfulTripsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getWeeklySuccessfulTripsCount"
    );
  }
  getAllCancleBookingsDispacter1() {
    return this.http.get<any>(
      environment.apiUrl + "api/getAllCancleBookingsDispacter"
    );
  }
  getAllCancleBookingsDispacter(dataTablesParams) {
    let apiUrlLink = "api/getAllCancleBookingsDispacter?";
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
  getMonthlyCancleBookingsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getMonthlyCancleBookingsCount"
    );
  }
  getWeeklyCancleBookingsCount() {
    return this.http.get<any>(
      environment.apiUrl + "api/getWeeklyCancleBookingsCount"
    );
  }
  getAllAcceptedBookingdDispacterPDF(){
    return this.http.get<any>(environment.apiUrl + 'api/getAllAcceptedBookingdDispacterPDF');
}
getAllOnRideDispacterPDF(){
  return this.http.get<any>(environment.apiUrl + 'api/getAllOnRideDispacterPDF');
}
getAllSuccessfulTripsDispacterPDF(){
  return this.http.get<any>(environment.apiUrl + 'api/getAllSuccessfulTripsDispacterPDF');
}
getAllCancleBookingsDispacterPDF(){
  return this.http.get<any>(environment.apiUrl + 'api/getAllCancleBookingsDispacterPDF');
}
getAllReceivedBookingsDispacterPDF(){
  return this.http.get<any>(environment.apiUrl + 'api/getAllReceivedBookingsDispacterPDF');
}
  
}
 