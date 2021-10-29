import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.service";
import { DriverService, AuthService } from "../../services";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import * as moment from "moment";
import { NotifyService } from "../../services/notify.service";
import { environment } from "src/environments/environment";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "list-notification",
  templateUrl: "./list-notification.component.html",
})
export class ListNotificationComponent implements OnInit {
  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  public startData = 1;
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
  profilePhotoUrl: string;
  notificationDetails: any;
  exportExcelData = [];
  getPdfData: any;
  NOtificationPhotoUrl: string;
  notification = false;

  constructor(
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private driverService: DriverService,
    private authService: AuthService,
    private notifyService: NotifyService,

    private toastyService: ToastyService
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
  }
  generatePdf() {
    // import 'jspdf-autotable';

    this.loading = true;
    this.notifyService.getAllNotificationListPDF().subscribe(
      (respone) => {
        // console.log("getPdfData",respone.data.data)

        this.getPdfData = respone.data.data;
        //  this.jsonObj = respone.data;
        // console.log("getPdfData",this.getPdfData)
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
    const header = [["No","Notification Title", "Description", "Type", "CreatedAt", "Status"]];
    const rows = [];
    const data = this.getPdfData;
    var i = 0;
    data.forEach((element) => {
      i += 1;
      const temp = [
        i,
        element.title,
        element.description,
        element.type,
        moment(element.createdAt).format("DD/MM/YYYY"),
        element.status ? "Active" : "Inactive",
      ];
      rows.push(temp);
    });

    //  @ts-ignore
    downloadPDF.autoTable({
      head: header,
      body: rows,
    });

    this.loading = false;

    downloadPDF.save("List-Notification-data.pdf");
  }

  exporExcel() {
    this.loading = true;
    this.notifyService.getAllNotification1().subscribe(
      (resp) => {
        var i = 0;
        resp.data.data[0].notificationList.map((element) => {
          i += 1;
          this.exportExcelData.push({
            "No": i,
            "Notification Title": element.title,
            "Description": element.description,
            "Type": element.type,
            "Create Date": moment(element.createdAt).format("DD/MM/YYYY"),
            "Status": element.status ? "Active" : "Inactive",
          });
        });
        this.loading = false;
        this.excelService.exportAsExcelFile(
          this.exportExcelData,
          "List_Notification"
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
    this.profilePhotoUrl = environment.profileImageUrl;
    this.NOtificationPhotoUrl = environment.notification_media_large_url;

    this.authService.clearDataTableData("DataTables_component");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, "desc"],
      serverSide: true,
      processing: true,
      stateSave: true,

      stateSaveCallback: function (settings, data) {
        localStorage.setItem("DataTables_component", JSON.stringify(data));
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_component"));
      },

      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        );
        dataTablesParameters.filter = this.filterValue;

        // console.log("dataTablesParameters : ",dataTablesParameters)
        this.startData =
          dataTablesParameters.start == 0 ? 1 : dataTablesParameters.start + 1;
        this.notifyService.getAllNotification(dataTablesParameters).subscribe(
          (resp) => {
            console.log(resp.data.data[0].notificationList);
            this.loading = false;

            this.notificationDetails = resp.data.data[0].notificationList;
            this.notification = this.notificationDetails.length > 0;
            var inputs = document.getElementsByTagName("input");

            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].type.toLowerCase() == "search") {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            // console.log("this.notificationDetails",this.notificationDetails)
            // console.log("this.notificationDetails",resp.data.data[0].notificationList.length)

            callback({
              recordsTotal: resp.data.data[0].notificationList.length,
              recordsFiltered:
                resp.data.data[0].notificationList.length > 0
                  ? resp.data.data[0].notificationCount[0].totalCount
                  : 0,
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
        { data: "no", orderable: false, searchable: false },
        { data: "title" },
        { data: "description" },
        { data: "media", orderable: false, searchable: false },
        { data: "type" },
        { data: "createdAt" },
        { data: "status" },
        { data: "action", orderable: false, searchable: false },
      ],
    };
  }

  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + "default.png";
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
    // Menu Active process Start
    // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    // {
    //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    // }
    // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[6].getElementsByTagName("li")[0].className = "ng-star-inserted active"
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
    console.log(this.filterForm.value);

    this.filterValue = {
      fromDate: fromDate.year + "-" + fromDate.day + "-" + fromDate.month,
      toDate: toDate.year + "-" + toDate.day + "-" + toDate.month,
    };
    console.log(this.filterValue);
    this.rerender();
  }

  resetFilter() {
    this.submitted = false;
    this.filterValue = {};
    this.filterForm.reset();
    this.rerender();
  }
}
