import { Component, OnInit, NgZone, OnDestroy, ViewChild } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DispatcherService } from "../../services/dispatcher.service";
import { ToastOptions, ToastData, ToastyService } from "ng2-toasty";
import * as moment from "moment";
import { AuthService, DriverService } from "../../services";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
// import { environment } from "src/environments/environment";
import "jspdf-autotable";
import * as jsPDF from "jspdf";
import { ExcelService } from "../../services/excel.service";
am4core.useTheme(am4themes_animated);

@Component({
  selector: "cancel",
  templateUrl: "./cancel.component.html",
})
export class CancelComponent implements OnInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ["", Validators.required],
    toDate: ["", Validators.required],
  });
  filterValue: any = {};
  cancelBooking: any;
  weeklyCancelBooking: any;
  monthltCancelBooking: any;
  getPdfData: any;
  exportExcelData = [];

  constructor(
    private zone: NgZone,
    private dispatcherService: DispatcherService,
    config: NgbDatepickerConfig,
    private fb: FormBuilder,
    private driverService: DriverService,
    private authService: AuthService,
    private toastyService: ToastyService,
    private excelService: ExcelService
  ) {}
  generatePdf() {
    // import 'jspdf-autotable';

    this.loading = true;
    this.dispatcherService.getAllCancleBookingsDispacterPDF().subscribe(
      (respone) => {
        this.getPdfData = respone.data.AllCancleBookingsDispacter;
        //  this.jsonObj = respone.data;
        console.log("getPdfData", this.getPdfData);
        //  this.data();
        this.exportDriverDataToPdf();
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

  exportDriverDataToPdf() {
    const downloadPDF = new jsPDF();
    const header = [
      [
        "Order Id",
        "Passenger",
        "Passenger Phone",
        "From",
        "To",
        "Driver",
        "Driver Phone",
        "Amount",
        "Date",
      ],
    ];
    const rows = [];

    const data = this.getPdfData;

    data.forEach((element) => {
      const temp = [
        element.rideId,
        element.passengerName,
        element.passengerPhone,
        element.pickupAddress,
        element.destinationAddress,
        element.driverName,
        element.driverPhone,
        element.toatlFare,
        moment(element.createdAt).format('YYYY-MM-DD'),
      ];
      rows.push(temp);
      //  console.log('Rows', rows); // showing all data
    });

    //  @ts-ignore
    downloadPDF.autoTable({
      head: header,
      body: rows,
    });

    this.loading = false;

    downloadPDF.save("Cancel_booking.pdf");
  }

  exporExcel() {
    this.loading = true;

    this.dispatcherService.getAllCancleBookingsDispacter1().subscribe(
      (resp) => {
        // console.log("log", resp.data.AllPromocode)

        resp.data.AllCancleBookingsDispacter.map((element) => {
          this.exportExcelData.push({
            "Order Id": element.rideId,
            "Customer": element.passengerName,
            "Passenger Phone": element.passengerPhone,
            "From": element.pickupAddress,
            "To": element.destinationAddress,
            "Driver": element.driverName,
            "Driver Phone": element.driverPhone,
            "Amount": element.toatlFare,
            "Date": moment(element.createdAt).format('YYYY-MM-DD'),
          });
        });
        this.loading = false;
        this.excelService.exportAsExcelFile(
          this.exportExcelData,
          "Cancel_booking"
        );

        this.exportExcelData = [];
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
  ngOnInit() {
     // Menu Active process Start
    //  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    //  {
    //    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    //  }
    //  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[1].getElementsByTagName("li")[0].className = "ng-star-inserted active"
     // menu Active Process End
    this.getMonthlyCancleBookingsCount();
    this.authService.clearDataTableData("DataTables_component");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, "desc"],
      serverSide: true,
      processing: true,
      stateSave: false,

      stateSaveCallback: function (settings, data) {
        localStorage.setItem("DataTables_component", JSON.stringify(data));
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_component"));
      },

      ajax: (dataTablesParameters: any, callback) => {
        console.log(dataTablesParameters);
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        );
        dataTablesParameters.filter = this.filterValue;

        this.dispatcherService
          .getAllCancleBookingsDispacter(dataTablesParameters)
          .subscribe(
            (resp) => {
              this.loading = false;
              this.cancelBooking = resp.data.AllCancleBookingsDispacter;
              var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
              callback({
                recordsTotal: resp.data.recordsTotal,
                recordsFiltered: resp.data.recordsFiltered,
                data: [],
              });
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
      },
      columns: [
        { data: "rideId" ,searchable:true},
        { data: "passengerName",searchable:true },
        { data: "passengerPhone" ,searchable:true},
        { data: "pickupAddress",searchable:true },
        { data: "destinationAddress",searchable:true },
        { data: "driverName",searchable:true },
        { data: "driverPhone",searchable:true },
        { data: "toatlFare",searchable:true },
        { data: "createdAt" },
      ],
    };

    // this.dispatcherService
    // .getAllCancleBookingsDispacter()
    // .subscribe(respone => {
    //   this.cancelBooking = respone.data.AllCancleBookingsDispacter;

    //   console.log("cancelBooking", this.cancelBooking);
    // });
  }
  getMonthlyCancleBookingsCount() {
    this.dispatcherService
      .getMonthlyCancleBookingsCount()
      .subscribe((respone) => {
        this.monthltCancelBooking = respone.data.MonthlyCancleBookingsCount;
        console.log(" this.monthltCancelBooking", this.monthltCancelBooking);
        this.zone.runOutsideAngular(() => {
          let lineChart = am4core.create(
            "cancelDispatcherStaticsChart",
            am4charts.XYChart
          );
          let data = [
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

          for (
            let i = 0;
            i < respone.data.MonthlyCancleBookingsCount.length;
            i++
          ) {
            data[
              Number(respone.data.MonthlyCancleBookingsCount[i]._id.month) - 1
            ]["count"] = respone.data.MonthlyCancleBookingsCount[i].count;
          }
          lineChart.data = data;

          let xAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
          xAxis.title.text = "Month";
          xAxis.dataFields.category = "month";

          let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
          yAxis.title.text = "Count";
          yAxis.renderer.minWidth = 20;
          let seriesName = ["count"];
          for (let i = 0; i < seriesName.length; i++) {
            var series = lineChart.series.push(new am4charts.LineSeries());
            series.dataFields.categoryX = "month";
            series.dataFields.valueY = seriesName[i];
            series.name = seriesName[i];

            let bullet = series.bullets.push(new am4charts.CircleBullet());
            bullet.circle.strokeWidth = 2;
            bullet.circle.radius = 4;
            bullet.tooltipText = "Month:{categoryX} \n Count: {valueY} {name}";
          }
        });
        // console.log("line month", this.monthltReceivedBooking);
      });
  }
  getWeeklyCancleBookingsCount() {
    this.zone.runOutsideAngular(() => {
      let lineChart1 = am4core.create(
        "cancelDispatcherStaticsChart",
        am4charts.XYChart
      );
      lineChart1.exporting.menu = new am4core.ExportMenu();
      lineChart1.exporting.menu.align = "right";
      lineChart1.exporting.menu.verticalAlign = "top";
      lineChart1.exporting.menu.items = [
        {
          label: "...",
          menu: [
            { type: "pdf", label: "PDF" },
            { type: "xlsx", label: "Excel" },
          ],
        },
      ];
      let liveData = [];

      // let liveData = [
      //   { month: "A", count: 20 },
      //   { month: "B", count: 25 },
      //   { month: "C", count: 15 },
      //   { month: "D", count: 30 }
      // ];

      this.dispatcherService.getWeeklyCancleBookingsCount().subscribe(
        (respone) => {
          // console.log("live monthly data",respone.data.monthlyLiveTripsCount[0]._id)
          this.weeklyCancelBooking = respone.data.weeklyCancleBookingsCount;
          console.log("weeklyCancelBooking", this.weeklyCancelBooking);
          // for(let i=0;i<respone.data.weeklyLiveTripsCount.length;i++){
          //   liveData[Number(respone.data.weeklyLiveTripsCount[i]._id)-1]["count"] = respone.data.weeklyLiveTripsCount[i].count;
          // }
          liveData = respone.data.weeklyCancleBookingsCount;
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
          // this.loading = false;
          // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
        }
      );
    });
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
      theme: options.theme,
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}
