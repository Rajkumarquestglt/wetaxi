import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { DriverService, AuthService } from "../../services";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import { environment } from "src/environments/environment";
import * as moment from "moment";
import { ActionLogsService } from "../../services/action-logs.service";
import { ExcelService } from "../../services/excel.service";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "list-action-log",
  templateUrl: "./list-action-log.component.html",
})
export class ListActionLogsComponent implements OnInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  exportActionLogExcel = [];
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  drivers;
  profilePhotoUrl: any;
  balanceData: any;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ["", Validators.required],
    toDate: ["", Validators.required],
  });
  filterValue: any = {};
  getPdfData: any;
  url: any;
  constructor(
    private driverService: DriverService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private actionLogsService: ActionLogsService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
  }
  exportCSV() {
    this.loading = true;
    this.actionLogsService.getAllActionLogCSV().subscribe(
      (respone) => {
        this.loading = false;
        this.url = respone.URL;
        window.location.href = respone.URL;
        // window.open(this.url, '_blank');
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
  generatePdf() {
    this.loading = true;
    this.actionLogsService.getAllActionLogPDF().subscribe(
      (respone) => {
        this.getPdfData = respone.data;
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
        // "No",
        "User Name",
        "Type",
        "Activities",
        "Open Last Date",
        "Opened Page",
      ],
    ];
    const rows = [];

    const data = this.getPdfData;
    console.log(data);
    if (data.length > 0) {
      data.forEach((element) => {
        const temp = [
          // element.autoIncrementID,
          element.userName,
          element.userGroup,
          element.activities,
          moment(element.actionAt).format("YYYY-MM-DD, h:mm a"),
          element.openedPage,
        ];
        rows.push(temp);
        //  console.log('Rows', rows); // showing all data
      });
    } else {
      this.loading = false;
      this.addToast({
        title: "Error",
        msg: "No data found",
        timeout: 5000,
        theme: "default",
        position: "bottom-right",
        type: "error",
      });
      return;
    }

    //  @ts-ignore
    downloadPDF.autoTable({
      head: header,
      body: rows,
    });

    this.loading = false;

    downloadPDF.save("Activity-log-data.pdf");
  }

  ngOnInit() {
    this.profilePhotoUrl = environment.profileImageUrl;
    this.authService.clearDataTableData("DataTables_driver_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      order: [0, "desc"],
      processing: false,
      stateSave: true,
      stateSaveCallback: function (settings, data) {
        localStorage.setItem(
          "DataTables_driver_management",
          JSON.stringify(data)
        );
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_driver_management"));
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        );
        dataTablesParameters.filter = this.filterValue;
        this.actionLogsService
          .ListOfallActionLog(dataTablesParameters)
          .subscribe(
            (resp) => {
              this.loading = false;
              this.drivers = resp.data;
              var inputs = document.getElementsByTagName("input");
              for (var i = 0; i < inputs.length; i++) {
                if (inputs[i].type.toLowerCase() == "search") {
                  inputs[i].style.width = 15 + "vw";
                  inputs[i].style.minWidth = 150 + "px";
                }
              }

              callback({
                recordsTotal: resp.recordsTotal,
                recordsFiltered: resp.recordsFiltered,
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
        { data: "autoIncrementID" },
        { data: "userName" },
        { data: "userType" },
        { data: "action" },
        { data: "createdAt" },
        { data: "section" },
        // { data: "actionAt" ,orderable:false,searchable:false },
      ],
    };
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

  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + "default.png";
  }

  exportAsXLSX_Actionlog() {
    this.loading = true;
    this.actionLogsService
      .ListOfallActionLog({ filter: this.filterValue })
      .subscribe(
        (resp) => {
          resp.data.map((element) => {
            this.exportActionLogExcel.push({
              No: element.autoIncrementID,
              "User Name": element.userName,
              Type: element.userType,
              Activities: element.action,
              "Open Last Date": moment(element.actionAt).format(
                "YYYY-MM-DD, h:mm a"
              ),
              "Opened Page": element.section,
            });
          });
          this.loading = false;
          this.excelService.exportAsExcelFile(
            this.exportActionLogExcel,
            "ActionLogs"
          );
          this.exportActionLogExcel = [];
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    // Menu Active process Start
    // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    // {
    //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    // }
    // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[20].getElementsByTagName("li")[0].className = "ng-star-inserted active"
    // menu Active Process End
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  filterList() {
    this.submitted = true;

    if (this.filterForm.status == "INVALID") return;

    let { fromDate, toDate } = this.filterForm.value;

    this.filterValue = {
      fromDate: moment()
        .year(fromDate.year)
        .month(fromDate.month - 1)
        .date(fromDate.day)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)
        .toISOString(),
      toDate: moment()
        .year(toDate.year)
        .month(toDate.month - 1)
        .date(toDate.day)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .milliseconds(999)
        .toISOString(),
    };

    this.rerender();
  }

  resetFilter() {
    this.submitted = false;
    this.filterValue = {};
    this.filterForm.reset();
    this.rerender();
  }
}
