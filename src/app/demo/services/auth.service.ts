import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import "rxjs/add/operator/map";
import { NgxPermissionsService } from "ngx-permissions";
@Injectable()
export class AuthService {
  authParams: object;
  authToken: string;

  constructor(
    private http: HttpClient,
    private permissionsService: NgxPermissionsService
  ) {}

  doLogin(loginData: object) {
    return this.http
      .post<any>(environment.apiUrl + "auth/login", loginData)
      .map((response) => {
        if (response.status_code == 200) {
          if (response.data.type == "vehicleOwner") {
            this.authParams = {
              admin_id: response.data._id,
              email: response.data.email,
              name: response.data.name,
              // 'first_name': response.data.first_name,
              // 'last_name': response.data.last_name,
              type: response.data.type,
              chnagePassordPer: response.data.canChangePassword,
            };
          } else if (response.data.type == "promoter") {
            this.authParams = {
              admin_id: response.data._id,
              email: response.data.email,
              name: response.data.name,
              // 'first_name': response.data.first_name,
              // 'last_name': response.data.last_name,
              type: response.data.type,
              chnagePassordPer: response.data.canChangePassword,
            };
          } else {
            this.authParams = {
              admin_id: response.data._id,
              email: response.data.email,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              type: response.data.type,
              chnagePassordPer: true,
            };
          }
          localStorage.setItem("access_token", response.data.access_token);
          localStorage.setItem("adminData", JSON.stringify(this.authParams));

          if (response.data.type == "admin") {
            this.permissionsService.loadPermissions(
              environment.adminPermission
            );
          } else if (response.data.type == "promoter") {
            this.permissionsService.loadPermissions(
              environment.promoterPermission
            );
          } else {
            this.permissionsService.loadPermissions(
              environment.operatorPermission
            );
          }
        }
        return response;
      });
  }

  doLogout() {
    this.clearDataTableData("");
    // localStorage.removeItem("access_token");
    // localStorage.removeItem("adminData");
    localStorage.clear();
  }
forgotPassword(data: any){
  return this.http.post<any>(environment.apiUrl + 'auth/forgotPassword', data);
}
checkOtp(data: any){
  return this.http.post<any>(environment.apiUrl + 'auth/checkOtp', data);

}
reserPassword(data: any){
  return this.http.post<any>(environment.apiUrl + 'auth/resetPassword', data);
}
  getDashboardData() {
    return this.http.get<any>(environment.apiUrl + "api/getDashboardData");
  }
  getDashboardDataPromoter() {
    return this.http.get<any>(environment.apiUrlPromoter + "api/getDashboardData");
  }
  getdashboardVehicleOwnerTableData(){
    return this.http.get<any>(environment.apiUrlVo + "api/dashboardTableData");
  }
  withdrawal(data: any){
    
    let adminData = JSON.parse(localStorage.getItem("adminData"));
  
  if(adminData.type == "promoter"){
    return this.http.post<any>(environment.apiUrlPromoter + 'api/withdraw', data);
  }else{
    return this.http.post<any>(environment.apiUrlVo + 'api/withdraw', data);
  }
  }
  getwalletNew (){
    let adminData = JSON.parse(localStorage.getItem("adminData"));
  
  if(adminData.type == "promoter"){
    return this.http.get<any>(environment.apiUrlPromoter + "api/walletNew ");
  }else{
    return this.http.get<any>(environment.apiUrlVo + "api/walletNew ");
  }
  }
  getDashboardDataVehicleOwners() {
    return this.http.get<any>(environment.apiUrlVo + "api/dashboardData");
  }
  getDashboardDriverDataPromoters() {
    return this.http.get<any>(environment.apiUrlPromoter + "api/getDashboardDriversData");
  }
  getIncomeRelatedData() {
    return this.http.get<any>(environment.apiUrl + "api/getIncomeRelatedData");
  }

  getDashboardMapData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardProvinceData"
    );
  }

  getTopTenDriverAndPassengerData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getTopTenDriverAndPassengerData"
    );
  }

  clearDataTableData(module: any) {
    if (module != "DataTables_passenger_management") {
      localStorage.removeItem("DataTables_passenger_management");
    }
    if (module != "DataTables_promotion_code") {
      localStorage.removeItem("DataTables_promotion_code");
    }
    if (module != "DataTables_component") {
      localStorage.removeItem("DataTables_component");
    }
    if (module != "DataTables_driver_management") {
      localStorage.removeItem("DataTables_driver_management");
    }
    if (module != "DataTables_vehicle_management") {
      localStorage.removeItem("DataTables_vehicle_management");
    }
    if (module != "DataTables_help_center_management") {
      localStorage.removeItem("DataTables_help_center_management");
    }
    if (module != "DataTables_emergency_management") {
      localStorage.removeItem("DataTables_emergency_management");
    }
    if (module != "DataTables_billing_plan_management") {
      localStorage.removeItem("DataTables_billing_plan_management");
    }
    if (module != "DataTables_operator_management") {
      localStorage.removeItem("DataTables_operator_management");
    }
    if (module != "DataTables_credit_management") {
      localStorage.removeItem("DataTables_credit_management");
    }
    if (module != "DataTables_heirarchy_management") {
      localStorage.removeItem("DataTables_heirarchy_management");
    }
  }
  // New Api
  getDashboardProvinceData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardProvinceData"
    );
  }
  getDashboardCustomerData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardCustomerData"
    );
  }
  getDashboardDriversData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardDriversData"
    );
  }
  getDashboardTripsData() {
    return this.http.get<any>(environment.apiUrl + "api/getDashboardTripsData");
  }
  getDashboardNetSalesData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardNetSalesData"
    );
  }
  getDashboardSaleRevenueData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardSaleRevenueData"
    );
  }
  getDashboardCancleReasonData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardCancleReasonData"
    );
  }
  getDashboardDailyLiveDrivers() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardDailyLiveDrivers"
    );
  }
  getDashboardMonthlyLiveTripData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardMonthlyLiveTripData"
    );
  }
  getDashboardWeeklyLiveTripData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardWeeklyLiveTripData"
    );
  }
  getDashboardCancleReasonWeeklyData() {
    return this.http.get<any>(
      environment.apiUrl + "api/getDashboardCancleReasonWeeklyData"
    );
  }
}
