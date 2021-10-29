import {
  Component,
  NgZone,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
declare const AmCharts: any;
declare var $: any;
import * as am4core from "@amcharts/amcharts4/core";
import * as jsPDF from "jspdf";
import * as am4charts from "@amcharts/amcharts4/charts";
// import * as am4maps from "@amcharts/amcharts4/maps";
// import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { AuthService } from "../services/index.js";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { ExcelService } from "../services/excel.service.js";
import { SettingService } from "../services/setting.service.js";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl, Validators } from "@angular/forms";
// import { Validation } from '../helper/validation.js';
import { ActivatedRoute, Router } from "@angular/router";
// just an interface for type safety.
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  public position = "bottom-right";
  public dashboardData: any = {};
  vehicleOwnerDashboardData: any = {};
  promoterDashboardData: any = {};
  public interval: any;
  closeResult: string;
  withdrawal: FormGroup;
  public exportPassengerEarningExcel = [];
  public exportDriverEarningExcel = [];
  public exportPassengerRideExcel = [];
  public exportDriverRideExcel = [];
  public exportDriverReferralPeopleExcel = [];
  public exportPassengerReferralPeopleExcel = [];
  public maplivedata: any;
  public balanceData: any;
  public topTenData: any;
  public totalDate;
  public IncomeData;
  public daily = [];
  public isSubmitted: boolean = false;
  public exportDailyExcel = [];
  public exportMonthlyExcel = [];
  public exportVahicleExcel = [];
  public CustomerData;
  public DriverData;
  public TripData;
  public SaleRevenueData;
  public NetSalesData;
  public CancelReasonData;
  public active;
  public DailyLiveData;
  private chart: am4charts.XYChart;
  exportDriverTopupExcel = [];
  exportDriverIncomeExcel = [];
  exportCompanyNetIncomeExcel = [];
  exportReferAndEarnExpanseExcel = [];
  @ViewChild("closeBtn") closeBtn;
  @ViewChild("modalDefault") modalDefault;
  @ViewChild("modalDefault1") modalDefault1;
  @ViewChild("modalDefault2") modalDefault2;
  @ViewChild("modalDefault3") modalDefault3;
  @ViewChild("modalDefault4") modalDefault4;
  @ViewChild("modalDefault5") modalDefault5;
  @ViewChild("content") content: ElementRef;
  @ViewChild("driver") driver: ElementRef;
  @ViewChild("vehicleOwner") vehicleOwner: ElementRef;
  @ViewChild("promoter") promoter: ElementRef;
  test: any;
  userType: any;
  onlineOfflineData: any;
  vehicleOwnerDetais: any;
  promoterDriverDetails: any;
  promoterDriverData: any;
  allCarsStatus: any;
  dashboardVehicleOwnerTableData: any;
  totalAmount: any;

  constructor(
    // private validation: Validation,
    private authService: AuthService,
    private toastyService: ToastyService,
    private excelService: ExcelService,
    private settingService: SettingService,
    private modalService: NgbModal,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  // google maps zoom level
  zoom: number = environment.default_map_zoom;
  vehicleTypeImageUrl: any = environment.vehicleTypeImageUrl;

  // initial center position for the map
  lat: number = 11.565442;
  lng: number = 104.9169263;
  markers: marker[] = [];

  clickedMarker(label: string, index: number) {}

  exportToPdf(): void {
    let content = this.content.nativeElement;

    console.log("content", content);
    let doc = new jsPDF();
    let _elementHandlers = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(content.innerHTML, 15, 15, {
      width: 190,
      elementHandlers: _elementHandlers,
    });

    doc.save("Drivers-Data.pdf");
  }
  exportVehicleToPdf(): void {
    let vehicleOwner = this.vehicleOwner.nativeElement;

    // console.log("vehicleOwner", vehicleOwner);
    let doc = new jsPDF();
    let _elementHandlers = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(vehicleOwner.innerHTML, 15, 15, {
      width: 190,
      elementHandlers: _elementHandlers,
    });

    doc.save("Vehicle-Owner-Data.pdf");
  }
  exportPromoterToPdf(): void {
    let promoter = this.promoter.nativeElement;

    // console.log("promoter", promoter);
    let doc = new jsPDF();
    let _elementHandlers = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(promoter.innerHTML, 15, 15, {
      width: 190,
      elementHandlers: _elementHandlers,
    });

    doc.save("promoter-Data.pdf");
  }
  exportDriverDataToPdf(): void {
    let driver = this.driver.nativeElement;
    let doc = new jsPDF();
    let _elementHandlers = {
      "#editor": function (element, renderer) {
        return true;
      },
    };
    doc.fromHTML(driver.innerHTML, 15, 15, {
      width: 190,
      elementHandlers: _elementHandlers,
    });
    doc.save("Passengers-Data.pdf");
  }
  exportToExcel(tableID, filename = "") {
    var downloadurl;
    var dataFileType = "application/vnd.ms-excel";
    var tableSelect = document.getElementById(tableID);
    var tableHTMLData = tableSelect.outerHTML.replace(/ /g, "%50");

    // Specify file name
    filename = filename ? filename + ".xls" : "export_excel_data.xls";

    // Create download link element
    downloadurl = document.createElement("a");

    document.body.appendChild(downloadurl);

    if (navigator.msSaveOrOpenBlob) {
      var blob = new Blob(["\ufeff", tableHTMLData], {
        type: dataFileType,
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      // Create a link to the file
      downloadurl.href = "data:" + dataFileType + ", " + tableHTMLData;

      // Setting the file name
      downloadurl.download = filename;

      //triggering the function
      downloadurl.click();
    }
  }
  // openModals() {
  //   this.isSubmitted = false;
  //   this.modalDefault.show();
  // }
  // openModals1() {
  //   this.isSubmitted = false;
  //   this.modalDefault1.show();
  // }
  // openModals2() {
  //   this.isSubmitted = false;
  //   this.modalDefault2.show();
  // }
  // openModals3() {
  //   this.isSubmitted = false;
  //   this.modalDefault3.show();
  // }
  // openModals4() {
  //   this.isSubmitted = false;
  //   this.modalDefault4.show();
  // }
  // openModals5() {
  //   this.isSubmitted = false;
  //   this.modalDefault5.show();
  // }

  // mapClicked($event: MouseEvent) {
  //   // this.markers.push({
  //   //   lat: $event.coords.lat,
  //   //   lng: $event.coords.lng,
  //   //   draggable: true
  //   // });
  // }

  // markerDragEnd(m: marker, $event: MouseEvent) {}

  // onMouseOver(infoWindow, $event: MouseEvent) {
  //   infoWindow.open();
  // }

  // onMouseOut(infoWindow, $event: MouseEvent) {
  //   infoWindow.close();
  // }
  getdashboardVehicleOwnerTableData() {
    this.loading = true;
    this.authService.getdashboardVehicleOwnerTableData().subscribe(
      (respone) => {
        this.loading = false;
        this.dashboardVehicleOwnerTableData = respone.data;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }

  getDashboardData() {
    // this.loading = true;
    this.authService.getDashboardData().subscribe(
      (respone) => {
        // console.log("respone data",respone)
        // this.loading = false;
        this.dashboardData = JSON.parse(JSON.stringify(respone.data));
        this.vehicleOwnerDashboardData = respone.data.vehicleOwnerCount;
        this.promoterDashboardData = respone.data.promoterCount;
        this.test = respone.data.activeRideCount;
        //   console.log("vehicleOwnerDashboardData----------------->",this.vehicleOwnerDashboardData.totalCount )

        // console.log("promoterDashboardData----------------->",this.promoterDashboardData.totalCount )

        // this.lng = this.dashboardData.drivers[0].location.coordinates[0];
        // this.lat = this.dashboardData.drivers[0].location.coordinates[1];
        var now = new Date();
        this.daily = [];
        let testarray = [];
        this.totalDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();

        for (
          let index = 0;
          index < this.dashboardData.dailyEarning.length;
          index++
        ) {
          testarray.push(this.dashboardData.dailyEarning[index].date);
        }
        for (let index = 0; index < Number(this.totalDate); index++) {
          let i = index + 1;
          if (testarray.indexOf(i) != -1) {
            this.daily.push({
              date: this.dashboardData.dailyEarning[testarray.indexOf(i)].date,
              totalEarning: Math.round(
                this.dashboardData.dailyEarning[testarray.indexOf(i)]
                  .totalEarning
              ),
            });
          } else {
            this.daily.push({ date: i, totalEarning: 0 });
          }
        }

        // for (let index = 0; index < this.dashboardData.monthlyEarning.length; index++) {
        //   this.dashboardData.monthlyEarning[index].issetmonthname = moment().month(this.dashboardData.monthlyEarning[index].month - 1).format("MMMM") + "-" + this.dashboardData.monthlyEarning[index].year;
        // }

        for (
          let index = 0;
          index < this.dashboardData.totalVehicleType.length;
          index++
        ) {
          this.dashboardData.totalVehicleType[
            index
          ].isvehiclename = this.dashboardData.totalVehicleType[index].type.en;
        }
      },
      (error) => {
        // this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  getDashboardDataPromoters() {
    this.loading = true;
    this.authService.getDashboardDataPromoter().subscribe(
      (respone) => {
        this.loading = false;
        this.promoterDriverDetails = respone.data;
        this.vehicleOwnerDetais = respone.data.vehicleOwnerCount;
        // console.log(this.vehicleOwnerDetais)
        //
        // this.dashboardData = JSON.parse(JSON.stringify(respone.data));
        // this.vehicleOwnerDashboardData = respone.data.vehicleOwnerCount;
        // this.promoterDashboardData = respone.data.promoterCount;
        // this.test = respone.data.activeRideCount;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  getDashboardDataVehicleOwners() {
    this.loading = true;
    this.authService.getDashboardDataVehicleOwners().subscribe(
      (respone) => {
        this.loading = false;
        //  console.log({respone})
        this.allCarsStatus = respone.data;
        // this.dashboardData = JSON.parse(JSON.stringify(respone.data));
        // this.vehicleOwnerDashboardData = respone.data.vehicleOwnerCount;
        // this.promoterDashboardData = respone.data.promoterCount;
        // this.test = respone.data.activeRideCount;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  getDashboardDriverDataPromoters() {
    this.loading = true;
    this.authService.getDashboardDriverDataPromoters().subscribe(
      (respone) => {
        this.loading = false;
        this.promoterDriverData = respone.data;
        // this.dashboardData = JSON.parse(JSON.stringify(respone.data));
        // this.vehicleOwnerDashboardData = respone.data.vehicleOwnerCount;
        // this.promoterDashboardData = respone.data.promoterCount;
        // this.test = respone.data.activeRideCount;
      },
      (error) => {
        // this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  imgErrorHandler(event) {
    event.target.src = environment.profileImageUrl + "default.png";
  }

  getLowBalance() {
    this.loading = true;
    let demo = "admin Fee";
    this.settingService.GetAdminFee(demo).subscribe(
      (respone) => {
        this.loading = false;
        this.balanceData = respone.data.driverMinimumBalance;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }

  exportAsXLSX_Daily(): void {
    if (this.exportDailyExcel.length == 0) {
      let testarray = [];
      for (
        let index = 0;
        index < this.dashboardData.dailyEarning.length;
        index++
      ) {
        testarray.push(this.dashboardData.dailyEarning[index].date);
      }
      for (let index = 0; index < Number(this.totalDate); index++) {
        if (this.dashboardData.dailyEarning.length == 0) {
          let i = index + 1;
          this.exportDailyExcel.push({
            Date:
              i + "-" + moment().format("MM") + "-" + moment().format("YYYY"),
            TotalEarning: 0,
          });
        } else {
          let i = index + 1;
          if (testarray.indexOf(i) != -1) {
            this.exportDailyExcel.push({
              Date:
                this.dashboardData.dailyEarning[testarray.indexOf(i)].date +
                "-" +
                this.dashboardData.dailyEarning[testarray.indexOf(i)].month +
                "-" +
                this.dashboardData.dailyEarning[testarray.indexOf(i)].year,
              TotalEarning: this.dashboardData.dailyEarning[
                testarray.indexOf(i)
              ].totalEarning,
            });
          } else {
            this.exportDailyExcel.push({
              Date:
                i +
                "-" +
                this.dashboardData.dailyEarning[0].month +
                "-" +
                this.dashboardData.dailyEarning[0].year,
              TotalEarning: 0,
            });
          }
        }
      }
    }
    this.excelService.exportAsExcelFile(this.exportDailyExcel, "DailyIncome");
  }

  exportAsXLSX_PassengerEarning() {
    this.topTenData.topTenPassengerByRideSpentMoney.map((element) => {
      this.exportPassengerEarningExcel.push({
        AutoId: element.autoIncrementID,
        PassengerId: element.uniqueID,
        Email: element.email,
        Name: element.name,
        PassengerEarning: element.passengerEarning,
        CountryCode: element.countryCode,
        PhoneNumber: element.onlyPhoneNumber,
        DateOfBirth: moment(element.dob).format("YYYY-MM-DD"),
        RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
      });
    });
    this.excelService.exportAsExcelFile(
      this.exportPassengerEarningExcel,
      "PassengerEarning"
    );
    this.exportPassengerEarningExcel = [];
  }

  exportAsXLSX_PassengerRide() {
    this.topTenData.topTenPassengerByCompletedRide.map((element) => {
      this.exportPassengerRideExcel.push({
        AutoId: element.autoIncrementID,
        PassengerId: element.uniqueID,
        Email: element.email,
        Name: element.name,
        PassengerRide: element.totalCompletedRide,
        CountryCode: element.countryCode,
        PhoneNumber: element.onlyPhoneNumber,
        DateOfBirth: moment(element.dob).format("YYYY-MM-DD"),
        RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
      });
    });
    this.excelService.exportAsExcelFile(
      this.exportPassengerRideExcel,
      "PassengerRide"
    );
    this.exportPassengerRideExcel = [];
  }

  exportAsXLSX_DriverReferralPeopleCount() {
    this.topTenData.topTenDriverByTotalInvited.map((element) => {
      this.exportDriverReferralPeopleExcel.push({
        AutoId: element.autoIncrementID,
        VehicleId: element.uniqueID,
        Email: element.email,
        Name: element.name,
        DriverReferralCount: element.totalInvitedCount,
        Ratting: element.avgRating,
        Credit: element.creditBalance,
        CountryCode: element.countryCode,
        PhoneNumber: element.onlyPhoneNumber,
        DateOfBirth: moment(element.dob).format("YYYY-MM-DD"),
        RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
      });
    });
    this.excelService.exportAsExcelFile(
      this.exportDriverReferralPeopleExcel,
      "DriverReferralPeopleCount"
    );
    this.exportDriverReferralPeopleExcel = [];
  }

  exportAsXLSX_PassengerReferralPeopleCount() {
    this.topTenData.topTenPassengerByTotalInvited.map((element) => {
      this.exportPassengerReferralPeopleExcel.push({
        AutoId: element.autoIncrementID,
        PassengerId: element.uniqueID,
        Email: element.email,
        Name: element.name,
        PassengerReferralCount: element.totalInvitedCount,
        CountryCode: element.countryCode,
        PhoneNumber: element.onlyPhoneNumber,
        DateOfBirth: moment(element.dob).format("YYYY-MM-DD"),
        RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
      });
    });
    this.excelService.exportAsExcelFile(
      this.exportPassengerReferralPeopleExcel,
      "PassengerReferralPeopleCount"
    );
    this.exportPassengerReferralPeopleExcel = [];
  }

  exportAsXLSX_DriverEarning() {
    this.topTenData.topTenDriverByDrivingMoney.map((element) => {
      this.exportDriverEarningExcel.push({
        AutoId: element.autoIncrementID,
        VehicleId: element.uniqueID,
        Email: element.email,
        Name: element.name,
        DriverEarning: element.driverEarning,
        Ratting: element.avgRating,
        Credit: element.creditBalance,
        CountryCode: element.countryCode,
        PhoneNumber: element.onlyPhoneNumber,
        DateOfBirth: moment(element.dob).format("YYYY-MM-DD"),
        RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
      });
    });
    this.excelService.exportAsExcelFile(
      this.exportDriverEarningExcel,
      "DriverEarning"
    );
    this.exportDriverEarningExcel = [];
  }

  exportAsXLSX_DriverRide() {
    this.topTenData.topTenDriverByCompletedRide.map((element) => {
      this.exportDriverRideExcel.push({
        AutoId: element.autoIncrementID,
        VehicleId: element.uniqueID,
        Email: element.email,
        Name: element.name,
        DriverRide: element.totalCompletedRide,
        Ratting: element.avgRating,
        Credit: element.creditBalance,
        CountryCode: element.countryCode,
        PhoneNumber: element.onlyPhoneNumber,
        DateOfBirth: moment(element.dob).format("YYYY-MM-DD"),
        RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
      });
    });
    this.excelService.exportAsExcelFile(
      this.exportDriverRideExcel,
      "DriverRide"
    );
    this.exportDriverRideExcel = [];
  }

  // exportAsXLSX_Monthly(): void {
  //   if (this.exportMonthlyExcel.length == 0) {
  //     for (let index = 0; index < this.dashboardData.monthlyEarning.length; index++) {
  //       this.exportMonthlyExcel.push({ "Month": moment().month(this.dashboardData.monthlyEarning[index].month - 1).format("MMMM") + "-" + this.dashboardData.monthlyEarning[index].year, "TotalEarning": this.dashboardData.monthlyEarning[index].totalEarning })
  //     }
  //   }
  //   this.excelService.exportAsExcelFile(this.exportMonthlyExcel, 'MonthlyIncome');
  // }

  exportAsXLSX_Yearly(): void {
    this.excelService.exportAsExcelFile(
      this.dashboardData.yearlyEarning,
      "YearlyIncome"
    );
  }

  exportAsXLSX_DriverTopup(): void {
    this.exportDriverTopupExcel.push({
      "Driver Credit Today": this.IncomeData.DriverCredit.todays,
      "Driver Credit Yesterday": this.IncomeData.DriverCredit.yesterDays,
      "Driver Credit This month": this.IncomeData.DriverCredit.thisMonths,
      "Driver Credit Last month": this.IncomeData.DriverCredit.lastMonths,
      "Driver Credit This Year": this.IncomeData.DriverCredit.thisYears,
      "Driver Credit Last Year": this.IncomeData.DriverCredit.lastYears,
    });
    this.excelService.exportAsExcelFile(
      this.exportDriverTopupExcel,
      "Income Driver Top up"
    );
    this.exportDriverTopupExcel = [];
  }
  exportAsXLSX_DriverIncome(): void {
    this.exportDriverIncomeExcel.push({
      "Driver Income Today": this.IncomeData.DriverIncome.todays,
      "Driver Income Yesterday": this.IncomeData.DriverIncome.yesterDays,
      "Driver Income This month": this.IncomeData.DriverIncome.thisMonths,
      "Driver Income Last month": this.IncomeData.DriverIncome.lastMonths,
      "Driver Income This Year": this.IncomeData.DriverIncome.thisYears,
      "Driver Income Last Year": this.IncomeData.DriverIncome.lastYears,
    });
    this.excelService.exportAsExcelFile(
      this.exportDriverIncomeExcel,
      " Driver Income"
    );
    this.exportDriverIncomeExcel = [];
  }
  exportAsXLSX_CompanyNetIncome(): void {
    this.exportCompanyNetIncomeExcel.push({
      "Company Net Income Today": this.IncomeData.AdminIncome.todays,
      "Company Net Income Yesterday": this.IncomeData.AdminIncome.yesterDays,
      "Company Net Income This month": this.IncomeData.AdminIncome.thisMonths,
      "Company Net Income Last month": this.IncomeData.AdminIncome.lastMonths,
      "Company Net Income This Year": this.IncomeData.AdminIncome.thisYears,
      "Company Net Income Last Year": this.IncomeData.AdminIncome.lastYears,
    });
    this.excelService.exportAsExcelFile(
      this.exportCompanyNetIncomeExcel,
      " Company Net Income"
    );
    this.exportCompanyNetIncomeExcel = [];
  }
  exportAsXLSX_ReferAndEarnExpanse(): void {
    this.exportReferAndEarnExpanseExcel.push({
      "Refer And Earn Today": this.IncomeData.DriverRefEarn.todays,
      "Refer And Earn Yesterday": this.IncomeData.DriverRefEarn.yesterDays,
      "Refer And Earn This month": this.IncomeData.DriverRefEarn.thisMonths,
      "Refer And Earn Last month": this.IncomeData.DriverRefEarn.lastMonths,
      "Refer And Earn This Year": this.IncomeData.DriverRefEarn.thisYears,
      "Refer And Earn Last Year": this.IncomeData.DriverRefEarn.lastYears,
    });
    this.excelService.exportAsExcelFile(
      this.exportReferAndEarnExpanseExcel,
      "Refer And Earn Expanse"
    );
    this.exportReferAndEarnExpanseExcel = [];
  }

  exportAsXLSX_Vehicle(): void {
    if (this.exportVahicleExcel.length == 0) {
      for (
        let index = 0;
        index < this.dashboardData.totalVehicleType.length;
        index++
      ) {
        this.exportVahicleExcel.push({
          VehicleName: this.dashboardData.totalVehicleType[index].type.en,
          VehicleCount: this.dashboardData.totalVehicleType[index].count,
        });
      }
    }
    this.excelService.exportAsExcelFile(this.exportVahicleExcel, "VehicleInfo");
  }

  addToast(options) {
    if (options.closeOther) {
      this.toastyService.clearAll();
    }
    this.position = options.position ? options.position : this.position;
    const toastOptions: ToastOptions = {
      title: options.title,
      msg: options.msg,
      showClose: options.showClose,
      timeout: options.timeout,
      onAdd: (toast: ToastData) => {},
      onRemove: (toast: ToastData) => {},
    };

    switch (options.type) {
      case "default":
        this.toastyService.default(toastOptions);
        break;
      case "info":
        this.toastyService.info(toastOptions);
        break;
      case "success":
        this.toastyService.success(toastOptions);
        break;
      case "wait":
        this.toastyService.wait(toastOptions);
        break;
      case "error":
        this.toastyService.error(toastOptions);
        break;
      case "warning":
        this.toastyService.warning(toastOptions);
        break;
    }
  }

  getMapData() {
    this.authService.getDashboardMapData().subscribe(
      (respone) => {
        this.maplivedata = respone.data;
        for (let index = 0; index < this.maplivedata.length; index++) {
          if (this.maplivedata[index].isAvailable) {
            this.maplivedata[index].issetimage =
              environment.vehicleTypeImageUrl + "car_green.png";
          } else {
            this.maplivedata[index].issetimage =
              environment.vehicleTypeImageUrl + "car_red.png";
          }
        }
        this.markers = this.maplivedata.map(function (driver) {
          return {
            uniqueID: driver.uniqueID,
            lat: driver.location.coordinates[1],
            lng: driver.location.coordinates[0],
            name: driver.name,
            vehicleType:
              driver.vehicle &&
              driver.vehicle.typeId &&
              driver.vehicle.typeId.type &&
              driver.vehicle.typeId.type.en,
            rotation: 60,
            direction: driver.location.angle,
            zIndex: driver.location.angle,
            iconUrl: {
              url: driver.issetimage,
              scaledSize: {
                width: 30,
                height: 35,
              },
              offset: "0",
            },
          };
        });
      },
      (error) => {
        // this.loading = false;
        // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }

  getIncomeRelatedata() {
    this.authService.getIncomeRelatedData().subscribe(
      (respone) => {
        this.IncomeData = respone.data;
      },
      (error) => {
        // this.loading = false;
        // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }

  getTopTenData() {
    this.authService.getTopTenDriverAndPassengerData().subscribe(
      (respone) => {
        this.topTenData = respone.data;

        for (
          let index = 0;
          index < this.topTenData.topTenDriverByCompletedRide.length;
          index++
        ) {
          if (
            this.balanceData >=
            this.topTenData.topTenDriverByCompletedRide[index].creditBalance
          ) {
            this.topTenData.topTenDriverByCompletedRide[index].isSame = true;
          } else {
            this.topTenData.topTenDriverByCompletedRide[index].isSame = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenDriverByTotalInvited.length;
          index++
        ) {
          if (
            this.balanceData >=
            this.topTenData.topTenDriverByTotalInvited[index].creditBalance
          ) {
            this.topTenData.topTenDriverByTotalInvited[index].isSame = true;
          } else {
            this.topTenData.topTenDriverByTotalInvited[index].isSame = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenDriverByDrivingMoney.length;
          index++
        ) {
          if (
            this.balanceData >=
            this.topTenData.topTenDriverByDrivingMoney[index].creditBalance
          ) {
            this.topTenData.topTenDriverByDrivingMoney[index].isSame = true;
          } else {
            this.topTenData.topTenDriverByDrivingMoney[index].isSame = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenDriverByDrivingMoney.length;
          index++
        ) {
          if (
            moment().format("D") ==
              moment(
                this.topTenData.topTenDriverByDrivingMoney[index].dob
              ).format("D") &&
            moment().format("MMMM") ==
              moment(
                this.topTenData.topTenDriverByDrivingMoney[index].dob
              ).format("MMMM")
          ) {
            this.topTenData.topTenDriverByDrivingMoney[index].isSelected = true;
          } else {
            this.topTenData.topTenDriverByDrivingMoney[
              index
            ].isSelected = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenDriverByCompletedRide.length;
          index++
        ) {
          if (
            moment().format("D") ==
              moment(
                this.topTenData.topTenDriverByCompletedRide[index].dob
              ).format("D") &&
            moment().format("MMMM") ==
              moment(
                this.topTenData.topTenDriverByCompletedRide[index].dob
              ).format("MMMM")
          ) {
            this.topTenData.topTenDriverByCompletedRide[
              index
            ].isSelected = true;
          } else {
            this.topTenData.topTenDriverByCompletedRide[
              index
            ].isSelected = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenDriverByTotalInvited.length;
          index++
        ) {
          if (
            moment().format("D") ==
              moment(
                this.topTenData.topTenDriverByTotalInvited[index].dob
              ).format("D") &&
            moment().format("MMMM") ==
              moment(
                this.topTenData.topTenDriverByTotalInvited[index].dob
              ).format("MMMM")
          ) {
            this.topTenData.topTenDriverByTotalInvited[index].isSelected = true;
          } else {
            this.topTenData.topTenDriverByTotalInvited[
              index
            ].isSelected = false;
          }
        }

        for (
          let index = 0;
          index < this.topTenData.topTenPassengerByRideSpentMoney.length;
          index++
        ) {
          if (
            moment().format("D") ==
              moment(
                this.topTenData.topTenPassengerByRideSpentMoney[index].dob
              ).format("D") &&
            moment().format("MMMM") ==
              moment(
                this.topTenData.topTenPassengerByRideSpentMoney[index].dob
              ).format("MMMM")
          ) {
            this.topTenData.topTenPassengerByRideSpentMoney[
              index
            ].isSelected = true;
          } else {
            this.topTenData.topTenPassengerByRideSpentMoney[
              index
            ].isSelected = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenPassengerByCompletedRide.length;
          index++
        ) {
          if (
            moment().format("D") ==
              moment(
                this.topTenData.topTenPassengerByCompletedRide[index].dob
              ).format("D") &&
            moment().format("MMMM") ==
              moment(
                this.topTenData.topTenPassengerByCompletedRide[index].dob
              ).format("MMMM")
          ) {
            this.topTenData.topTenPassengerByCompletedRide[
              index
            ].isSelected = true;
          } else {
            this.topTenData.topTenPassengerByCompletedRide[
              index
            ].isSelected = false;
          }
        }
        for (
          let index = 0;
          index < this.topTenData.topTenPassengerByTotalInvited.length;
          index++
        ) {
          if (
            moment().format("D") ==
              moment(
                this.topTenData.topTenPassengerByTotalInvited[index].dob
              ).format("D") &&
            moment().format("MMMM") ==
              moment(
                this.topTenData.topTenPassengerByTotalInvited[index].dob
              ).format("MMMM")
          ) {
            this.topTenData.topTenPassengerByTotalInvited[
              index
            ].isSelected = true;
          } else {
            this.topTenData.topTenPassengerByTotalInvited[
              index
            ].isSelected = false;
          }
        }
      },
      (error) => {
        // this.loading = false;
        // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }
  getDashboardCustomerData() {
    this.authService.getDashboardCustomerData().subscribe(
      (respone) => {
        // console.log("Customer",respone.data)
        this.CustomerData = respone.data;
      },
      (error) => {
        // this.loading = false;
        // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }
  getDashboardDriversData() {
    this.authService.getDashboardDriversData().subscribe(
      (respone) => {
        // console.log("Driver",respone.data)
        this.DriverData = respone.data;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  getDashboardTripsData() {
    this.authService.getDashboardTripsData().subscribe(
      (respone) => {
        // console.log("Trip",respone.data)
        this.TripData = respone.data;
      },
      (error) => {
        // this.loading = false;
        // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }
  getDashboardSaleRevenueData() {
    this.authService.getDashboardSaleRevenueData().subscribe(
      (respone) => {
        // console.log("Sale Revenue",respone.data)
        this.SaleRevenueData = respone.data;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  getDashboardNetSalesData() {
    this.authService.getDashboardNetSalesData().subscribe(
      (respone) => {
        // console.log("Net sale",respone.data)
        this.NetSalesData = respone.data;
      },
      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  liveTripMonthly() {
    // dailyTripChart() {
    this.zone.runOutsideAngular(() => {
      let lineChart1 = am4core.create("dailyTripChart", am4charts.XYChart);
      lineChart1.exporting.menu = new am4core.ExportMenu();
      lineChart1.exporting.menu.container = document.getElementById("tools1");

      // lineChart1.exporting.menu.align = "right";
      // lineChart1.exporting.menu.verticalAlign = "top";
      lineChart1.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];
      lineChart1.logo.disabled = true;

      let liveData = [
        { month: "01", count: 0 },
        { month: "02", count: 0 },
        { month: "03", count: 0 },
        { month: "04", count: 0 },
        { month: "05", count: 0 },
        { month: "06", count: 0 },
        { month: "07", count: 0 },
        { month: "08", count: 0 },
        { month: "09", count: 0 },
        { month: "10", count: 0 },
        { month: "11", count: 0 },
        { month: "12", count: 0 },
      ];
      // let liveData = [
      //   { month: "A", count: 20 },
      //   { month: "B", count: 25 },
      //   { month: "C", count: 15 },
      //   { month: "D", count: 30 }
      // ];

      this.authService.getDashboardMonthlyLiveTripData().subscribe(
        (respone) => {
          // console.log("live monthly data",respone.data.monthlyLiveTripsCount[0]._id)
          this.DailyLiveData = respone.data.monthlyLiveTripsCount;
          // console.log("live monthly data",this.DailyLiveData)
          for (let i = 0; i < respone.data.monthlyLiveTripsCount.length; i++) {
            liveData[
              Number(respone.data.monthlyLiveTripsCount[i]._id.month) - 1
            ]["count"] = respone.data.monthlyLiveTripsCount[i].count;
          }

          lineChart1.data = liveData;
          let liveXaxis = lineChart1.xAxes.push(new am4charts.CategoryAxis());
          liveXaxis.title.text = "Month";
          liveXaxis.dataFields.category = "month";

          let liveYaxis = lineChart1.yAxes.push(new am4charts.ValueAxis());
          liveYaxis.title.text = "Count";
          liveYaxis.renderer.minWidth = 20;
          let liveTrip = ["count"];
          for (let i = 0; i < liveTrip.length; i++) {
            var series = lineChart1.series.push(new am4charts.LineSeries());
            series.dataFields.categoryX = "month";
            series.dataFields.valueY = liveTrip[i];
            series.name = liveTrip[i];

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.strokeWidth = 2;
            bullet.circle.radius = 4;
            bullet.tooltipText = "Month:{categoryX} \n Count: {valueY} {name}";
          }
        },
        (error) => {
          this.loading = false;
          this.addToast({
            title: "Error",
            msg: error.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "error",
          });
        }
      );
    });
    // }
  }
  liveTripWeekly() {
    this.zone.runOutsideAngular(() => {
      let lineChart1 = am4core.create("dailyTripChart", am4charts.XYChart);
      lineChart1.exporting.menu = new am4core.ExportMenu();
      lineChart1.exporting.menu.container = document.getElementById("tools");
      // lineChart1.exporting.menu.align = "right";
      // lineChart1.exporting.menu.verticalAlign = "top";
      lineChart1.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];
      lineChart1.logo.disabled = true;

      let liveData = [];

      // let liveData = [
      //   { month: "A", count: 20 },
      //   { month: "B", count: 25 },
      //   { month: "C", count: 15 },
      //   { month: "D", count: 30 }
      // ];

      this.authService.getDashboardWeeklyLiveTripData().subscribe(
        (respone) => {
          // console.log("live monthly data",respone.data.monthlyLiveTripsCount[0]._id)
          this.DailyLiveData = respone.data.weeklyLiveTripsCount;
          // console.log("live weekly data",respone.data.weeklyLiveTripsCount[0].count)
          // for(let i=0;i<respone.data.weeklyLiveTripsCount.length;i++){
          //   liveData[Number(respone.data.weeklyLiveTripsCount[i]._id)-1]["count"] = respone.data.weeklyLiveTripsCount[i].count;
          // }
          liveData = respone.data.weeklyLiveTripsCount;
          lineChart1.data = liveData;
          let liveXaxis = lineChart1.xAxes.push(new am4charts.CategoryAxis());
          liveXaxis.title.text = "Week";
          liveXaxis.dataFields.category = "week";

          let liveYaxis = lineChart1.yAxes.push(new am4charts.ValueAxis());
          liveYaxis.title.text = "Count";
          liveYaxis.renderer.minWidth = 20;
          let liveTrip = ["count"];
          for (let i = 0; i < liveTrip.length; i++) {
            var series = lineChart1.series.push(new am4charts.LineSeries());
            series.dataFields.categoryX = "week";
            series.dataFields.valueY = liveTrip[i];
            series.name = liveTrip[i];

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.strokeWidth = 2;
            bullet.circle.radius = 4;
            bullet.tooltipText = "Week:{categoryX} \n Count: {valueY} {name}";
          }
        },
        (error) => {
          this.loading = false;
          this.addToast({
            title: "Error",
            msg: error.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "error",
          });
        }
      );
    });
  }
  cancelReasonMonthly() {
    this.zone.runOutsideAngular(() => {
      let lineChart = am4core.create("cancelRideLineChart", am4charts.XYChart);
      lineChart.exporting.menu = new am4core.ExportMenu();
      lineChart.exporting.menu.container = document.getElementById("tools");
      // lineChart.exporting.menu.align = "right";
      // lineChart.exporting.menu.verticalAlign = "top";
      lineChart.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];
      lineChart.logo.disabled = true;
      // let data = [
      //   { month: "Jan"},
      //   { month: "Feb"},
      //   { month: "Mar"},
      //   { month: "Apr"},
      //   { month: "May"},
      //   { month: "Jun"},
      //   { month: "Jul"},
      //   { month: "Aug"},
      //   { month: "Sep"},
      //   { month: "Oct"},
      //   { month: "Nov"},
      //   { month: "Dec"},
      // ];

      let data = [
        { month: "01" },
        { month: "02" },
        { month: "03" },
        { month: "04" },
        { month: "05" },
        { month: "06" },
        { month: "07" },
        { month: "08" },
        { month: "09" },
        { month: "10" },
        { month: "11" },
        { month: "12" },
      ];

      var seriesName = [];
      this.authService.getDashboardCancleReasonData().subscribe(
        (respone) => {
          // console.log(
          //   "cancel Reason--------------------------------->",
          //   respone.data
          // );
          this.CancelReasonData = respone.data.thisMonthCancelledRideCount;
          for (
            let i = 0;
            i < respone.data.thisMonthCancelledRideCount.length;
            i++
          ) {
            //  console.log("respone.data.thisMonthCancelledRideCount[i]",respone.data.thisMonthCancelledRideCount[i])
            if (
              respone.data.thisMonthCancelledRideCount[i]._id.reasonText !==
              undefined
            ) {
              if (
                seriesName.indexOf(
                  respone.data.thisMonthCancelledRideCount[
                    i
                  ]._id.reasonText.replace(/ /g, "_")
                ) !== -1
              ) {
                // console.log("Value exists!")
              } else {
                seriesName.push(
                  respone.data.thisMonthCancelledRideCount[
                    i
                  ]._id.reasonText.replace(/ /g, "_")
                );
              }
            }
          }

          //  console.log("seriesName",seriesName)
          for (let i = 0; i < seriesName.length; i++) {
            var name = seriesName[i];
            for (let j = 0; j < data.length; j++) {
              data[j][name] = 0;
            }
          }
          // console.log("datayyy", data);
          for (
            let i = 0;
            i < respone.data.thisMonthCancelledRideCount.length;
            i++
          ) {
            if (
              respone.data.thisMonthCancelledRideCount[i]._id.reasonText !=
              undefined
            ) {
              // console.log("test", respone.data.thisMonthCancelledRideCount[i].count )

              //  console.log("ojk\\k",respone.data.thisMonthCancelledRideCount[i]._id.month)
              data[
                Number(respone.data.thisMonthCancelledRideCount[i]._id.month) -
                  1
              ][
                respone.data.thisMonthCancelledRideCount[
                  i
                ]._id.reasonText.replace(/ /g, "_")
              ] = respone.data.thisMonthCancelledRideCount[i].count;
            }
          }

          // console.log("datayyy", data);
          lineChart.data = data;

          let xAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
          xAxis.title.text = "Month";
          xAxis.dataFields.category = "month";

          let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
          yAxis.title.text = "Count";
          yAxis.renderer.minWidth = 20;

          // console.log("seriesName",seriesName.length)
          for (let i = 0; i < seriesName.length; i++) {
            // console.log(i)
            var series = lineChart.series.push(new am4charts.LineSeries());
            series.dataFields.categoryX = "month";
            series.dataFields.valueY = seriesName[i];
            series.name = seriesName[i];

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.strokeWidth = 2;
            bullet.circle.radius = 4;
            bullet.tooltipText = "Month:{categoryX} \n Count: {valueY} {name}";
          }
        },
        (error) => {
          this.loading = false;
          this.addToast({
            title: "Error",
            msg: error.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "error",
          });
        }
      );
    });
  }
  cancelReasonWeekly() {
    // console.log("clicked=------>")
    this.zone.runOutsideAngular(() => {
      let lineChart = am4core.create("cancelRideLineChart", am4charts.XYChart);
      lineChart.exporting.menu = new am4core.ExportMenu();
      lineChart.exporting.menu.align = "right";
      lineChart.exporting.menu.verticalAlign = "top";
      lineChart.logo.disabled = true;
      lineChart.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "csv", label: "CSV" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];
      var firstWeekOfMonth = moment(
        moment()
          .startOf("month")
          .hours(0)
          .minutes(0)
          .seconds(0)
          .milliseconds(0)
          .format()
      ).week();

      var lastWeekOfMonth = moment(
        moment()
          .endOf("month")
          .hours(23)
          .minutes(23)
          .seconds(0)
          .milliseconds(0)
          .format()
      ).week();
      let data = [
        // {week:"14"},
        // {week:"15"},
        // {week:"16"},
        // {week:"17"},
        // {week:"18"},
        // {week:"19"}
      ];

      var weekFirst = firstWeekOfMonth - 1;
      var weekLast = lastWeekOfMonth;
      // console.log("week",weekLast);
      // console.log("weekFirst",weekFirst);

      for (var i = weekFirst; i < weekLast; i++) {
        data.push({ week: i.toString() });
      }
      console.log(data);

      var seriesName = [];
      this.authService.getDashboardCancleReasonWeeklyData().subscribe(
        (respone) => {
          console.log(
            "cancel  weekly Reason--------------------------------->",
            respone.data
          );
          this.CancelReasonData = respone.data.thisMonthCancelledRideCount;

          for (
            let i = 0;
            i < respone.data.thisMonthCancelledRideCount.length;
            i++
          ) {
            //  console.log("respone.data.thisMonthCancelledRideCount[i]",respone.data.thisMonthCancelledRideCount[i])
            if (
              respone.data.thisMonthCancelledRideCount[i]._id.reasonText !==
              undefined
            ) {
              if (
                seriesName.indexOf(
                  respone.data.thisMonthCancelledRideCount[
                    i
                  ]._id.reasonText.replace(/ /g, "_")
                ) !== -1
              ) {
                // console.log("Value exists!")
              } else {
                seriesName.push(
                  respone.data.thisMonthCancelledRideCount[
                    i
                  ]._id.reasonText.replace(/ /g, "_")
                );
              }
            }
          }

          //  console.log("seriesName",seriesName)
          for (let i = 0; i < seriesName.length; i++) {
            var name = seriesName[i];
            for (let j = 0; j < data.length; j++) {
              data[j][name] = 0;
            }
          }
          // console.log("xyz", data);

          for (
            let i = 0;
            i < respone.data.thisMonthCancelledRideCount.length;
            i++
          ) {
            if (
              respone.data.thisMonthCancelledRideCount[i]._id.reasonText !=
              undefined
            ) {
              for (var x = 0; x < data.length; x++) {
                if (
                  data[x].week ==
                  Number(respone.data.thisMonthCancelledRideCount[i]._id.week)
                ) {
                  data[x][
                    respone.data.thisMonthCancelledRideCount[
                      i
                    ]._id.reasonText.replace(/ /g, "_")
                  ] = respone.data.thisMonthCancelledRideCount[i].count;
                }
              }
            }
          }

          for (var y = 0; y < data.length; y++) {
            data[y].week = y + 1;
          }

          // console.log("last data", data);
          // data=respone.data.thisMonthCancelledRideCount;
          lineChart.data = data;

          let xAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
          xAxis.title.text = "Week";
          xAxis.dataFields.category = "week";

          let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
          yAxis.title.text = "Count";
          yAxis.renderer.minWidth = 10;

          // console.log("seriesName------------------------------------------------------>>>>>>>>>>>>>>>>>>>",seriesName.length)
          for (let i = 0; i < seriesName.length; i++) {
            // console.log(i)
            var series = lineChart.series.push(new am4charts.LineSeries());
            series.dataFields.categoryX = "week";
            series.dataFields.valueY = seriesName[i];
            series.name = seriesName[i];

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.strokeWidth = 2;
            bullet.circle.radius = 4;
            bullet.tooltipText = "Week:{categoryX} \n Count: {valueY} {name}";
          }
        },
        (error) => {
          this.loading = false;
          this.addToast({
            title: "Error",
            msg: error.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "error",
          });
        }
      );
    });
  }

  dailyLiveTrack() {
    this.zone.runOutsideAngular(() => {
      let slicePieChart1 = am4core.create("dailyLiveTrack", am4charts.PieChart);
      slicePieChart1.exporting.menu = new am4core.ExportMenu();
      slicePieChart1.exporting.menu.align = "right";
      slicePieChart1.exporting.menu.verticalAlign = "top";
      slicePieChart1.logo.disabled = true;
      slicePieChart1.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];

      this.authService.getDashboardDailyLiveDrivers().subscribe(
        (respone) => {
          // console.log("live driver",respone.data)
          slicePieChart1.data = [
            {
              active: "Offline",
              data: respone.data.totalOfflineDrivers,
            },
            {
              active: "Online",
              data: respone.data.totalOnlineDrivers,
            },
          ];

          let pieSeries2 = slicePieChart1.series.push(
            new am4charts.PieSeries()
          );
          pieSeries2.colors.list = [
            am4core.color("red"),
            am4core.color("green"),
          ];
          pieSeries2.dataFields.value = "data";
          pieSeries2.dataFields.category = "active";
          slicePieChart1.innerRadius = am4core.percent(70);
          pieSeries2.labels.template.disabled = true;
          pieSeries2.ticks.template.disabled = true;
          pieSeries2.slices.template.tooltipText = "";
          slicePieChart1.legend = new am4charts.Legend();

          let label = pieSeries2.createChild(am4core.Label);
          let label1 = pieSeries2.createChild(am4core.Label);

          label.text = respone.data.totalDrivers + " Drivers";
          // label1.text = "\n \n Drivers";

          label.horizontalCenter = "middle";
          // label.align="center"
          label.verticalCenter = "middle";

          label.fontSize = 25;
        },
        (error) => {
          this.loading = false;
          this.addToast({
            title: "Error",
            msg: error.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "error",
          });
        }
      );
    });
  }
  dailyLiveTrackPromoters() {
    this.zone.runOutsideAngular(() => {
      let slicePieChart1 = am4core.create(
        "dailyLiveTrackPromoters",
        am4charts.PieChart
      );
      slicePieChart1.exporting.menu = new am4core.ExportMenu();
      slicePieChart1.exporting.menu.align = "right";
      slicePieChart1.exporting.menu.verticalAlign = "top";
      slicePieChart1.logo.disabled = true;

      slicePieChart1.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];

      this.authService.getDashboardDataPromoter().subscribe(
        (respone) => {
          // console.log("live driver",respone.data)
          slicePieChart1.data = [
            {
              active: "Online",
              data: respone.data.onlineVehicles,
            },
            {
              active: "Offline",
              data: respone.data.offlineVehicles,
            },
          ];

          let pieSeries2 = slicePieChart1.series.push(
            new am4charts.PieSeries()
          );
          pieSeries2.colors.list = [
            am4core.color("green"),
            am4core.color("red"),
          ];
          pieSeries2.dataFields.value = "data";
          pieSeries2.dataFields.category = "active";
          slicePieChart1.innerRadius = am4core.percent(70);
          pieSeries2.labels.template.disabled = true;
          pieSeries2.ticks.template.disabled = true;
          pieSeries2.slices.template.tooltipText = "";
          slicePieChart1.legend = new am4charts.Legend();

          let label = pieSeries2.createChild(am4core.Label);
          let label1 = pieSeries2.createChild(am4core.Label);

          label.text = respone.data.totalDrivers + " Drivers";
          // label1.text = "\n \n Drivers";

          label.horizontalCenter = "middle";
          // label.align="center"
          label.verticalCenter = "middle";

          label.fontSize = 25;
        },
        (error) => {
          this.loading = false;
          this.addToast({
            title: "Error",
            msg: error.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "error",
          });
        }
      );
    });
  }
  dailyTopIncome() {
    this.zone.runOutsideAngular(() => {
      let slicePieChart2 = am4core.create("dailyTopIncome", am4charts.PieChart);
      slicePieChart2.exporting.menu = new am4core.ExportMenu();
      slicePieChart2.exporting.menu.align = "right";
      slicePieChart2.exporting.menu.verticalAlign = "top";
      slicePieChart2.logo.disabled = true;

      slicePieChart2.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];
      slicePieChart2.data = [
        {
          driver: "Drive topup",
          points: 501.9,
        },
        {
          driver: "Drive Income",
          points: 401.9,
        },
        {
          driver: "Refer & Earn",
          points: 201.9,
        },
        {
          driver: "Pesenger's Expense",
          points: 301.9,
        },
      ];
      let pieSeries3 = slicePieChart2.series.push(new am4charts.PieSeries());
      pieSeries3.colors.list = [
        am4core.color("#845EC2"),
        am4core.color("#D65DB1"),
        am4core.color("#FF6F91"),
        am4core.color("#FF9671"),
      ];
      pieSeries3.dataFields.value = "points";
      pieSeries3.dataFields.category = "driver";
      slicePieChart2.innerRadius = am4core.percent(50);
      pieSeries3.labels.template.disabled = true;
      pieSeries3.ticks.template.disabled = true;
      pieSeries3.slices.template.tooltipText = "";
      slicePieChart2.legend = new am4charts.Legend();
      let label = pieSeries3.createChild(am4core.Label);

      label.text = "145,2142";
      label.horizontalCenter = "middle";
      label.verticalCenter = "middle";
      label.fontSize = 15;
    });
  }

  //   provinceBasedLocation(){
  //     this.zone.runOutsideAngular(() => {

  //       let chart = am4core.create("provinceBasedMap", am4maps.MapChart);
  //       chart.minZoomLevel = 2;
  //       let mapData: Array<any> = [];
  //       let obj = {}

  //           this.authService.getDashboardProvinceData().subscribe(
  //            respone => {
  //         // console.log("respone.data123",chart.dataSource.url="https://i.pinimg.com/originals/f2/57/78/f25778f30e29a96c44c4f72ef645aa63.png")
  //         respone.data.forEach(obj=> {
  //           obj = {
  //             "id":  obj.code,
  //             "name": obj.name,
  //             // "value": 12754378,
  //             // "color":  marker.href
  //           }
  //           mapData.push(obj)
  //        });
  //         // this.IncomeData = respone.data;
  //       },
  //       error => {
  //         this.loading = false;
  //         this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
  //       }
  //     );

  //       // Set map definition
  //       chart.geodata = am4geodata_worldLow;

  //       // Set projection
  //       chart.projection = new am4maps.projections.Miller();

  //       // Create map polygon series
  //       let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
  //       polygonSeries.exclude = ["AQ"];
  //       polygonSeries.useGeodata = true;
  //       polygonSeries.nonScalingStroke = true;
  //       polygonSeries.strokeWidth = 0.5;
  //       polygonSeries.calculateVisualCenter = true;
  //       let imageSeries = chart.series.push(new am4maps.MapImageSeries());
  //       imageSeries.data = mapData;
  //       imageSeries.dataFields.value = "value";

  //       let imageTemplate = imageSeries.mapImages.template;
  //       imageTemplate.nonScaling = true

  //       // let circle = imageTemplate.createChild(am4core.Circle);
  //       // circle.fillOpacity = 0;
  //       // circle.propertyFields.fill = "color";
  //       // circle.tooltipText = "{name}";

  //       let marker = imageTemplate.createChild(am4core.Image);
  //       marker.href = "https://i.pinimg.com/originals/f2/57/78/f25778f30e29a96c44c4f72ef645aa63.png";
  //       marker.width = 12;
  //        marker.height = 12;
  // marker.tooltipText = "{name}";

  //       // imageSeries.heatRules.push({
  //       //   "target": circle,
  //       //   "property": "radius",
  //       //   "min": 4,
  //       //   "max": 7,
  //       //   "dataField": "value"
  //       // })

  //       imageTemplate.adapter.add("latitude", function (latitude, target) {
  //         let id=(target.dataItem.dataContext as any).id;
  //         let polygon = polygonSeries.getPolygonById(id);
  //         if (polygon) {
  //           return polygon.visualLatitude;
  //         }
  //         return latitude;
  //       })

  //       imageTemplate.adapter.add("longitude", function (longitude, target) {
  //         let id=(target.dataItem.dataContext as any).id;
  //         let polygon = polygonSeries.getPolygonById(id);
  //         if (polygon) {
  //           return polygon.visualLongitude;
  //         }
  //         return longitude;
  //       })
  //     })
  //   }
  getwalletNew() {
    this.loading = true;

    this.authService.getwalletNew().subscribe(
      (respone) => {
        this.loading = false;
        this.totalAmount = respone.data;
      },

      (error) => {
        this.loading = false;
        this.addToast({
          title: "Error",
          msg: error.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    );
  }
  onFormSubmit() {
    this.isSubmitted = true;
    if (this.withdrawal.value.amount > 80000) {
    } else {
      if (this.withdrawal.valid) {
        this.loading = true;

        this.authService.withdrawal(this.withdrawal.value).subscribe(
          (next) => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({
                title: "Success",
                msg: next.message,
                timeout: 5000,
                theme: "default",
                position: "bottom-right",
                type: "success",
              });
              // this.closeBtn.nativeElement.click();
            } else {
              this.addToast({
                title: "Error",
                msg: next.message,
                timeout: 5000,
                theme: "default",
                position: "bottom-right",
                type: "error",
              });
            }
          },
          (error) => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({
              title: "Error",
              msg: error.message,
              timeout: 5000,
              theme: "default",
              position: "bottom-right",
              type: "error",
            });
          }
        );
      }
    }
  }
  ngOnInit() {
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = adminData.type;
    if (this.userType == "admin") {
      this.getLowBalance();
      this.getTopTenData();
      this.getDashboardData();

      this.getIncomeRelatedata();
      this.getDashboardCustomerData();
      this.getDashboardDriversData();
      this.getDashboardTripsData();
      this.getDashboardSaleRevenueData();
      this.getDashboardNetSalesData();

      this.interval = setInterval(() => {
        this.getDashboardCustomerData();
        this.getDashboardDriversData();
        this.getDashboardTripsData();
        this.getDashboardSaleRevenueData();
        this.getDashboardNetSalesData();
        this.getDashboardSaleRevenueData();
      }, 50000);
    } else if (this.userType == "promoter") {
      this.getDashboardDriverDataPromoters();
      this.getDashboardDataPromoters();
      this.getwalletNew();
      // this.getDashboardData();
    } else if (this.userType == "vehicleOwner") {
      this.getDashboardDataVehicleOwners();
      this.getdashboardVehicleOwnerTableData();
      this.getwalletNew();
    }
    this.withdrawal = new FormGroup({
      amount: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(9),
      ]),
    });
  }
  ngAfterViewInit() {
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = adminData.type;
    if (this.userType == "admin") {
      this.cancelReasonMonthly();
      // this.dailyTripChart();
      this.liveTripMonthly();
      this.dailyLiveTrack();
      // this.dailyTopIncome();
    } else if (this.userType == "promoter") {
      this.dailyLiveTrackPromoters();
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
