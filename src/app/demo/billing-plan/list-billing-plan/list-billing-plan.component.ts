import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BillingPlanService, AuthService, DriverService } from "../../services";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import {
  NgbDatepickerConfig,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import * as moment from "moment";
import { ExcelService } from "../../services/excel.service";
import * as jsPDF from "jspdf";
import "jspdf-autotable";

class BiilingPlan {
  name: string;
  details: string;
  billingType: string;
  chargeAmt: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: "list-billing-plan",
  templateUrl: "./list-billing-plan.component.html",
})
export class ListBillingplanComponent implements AfterViewInit, OnInit {
  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  billingPlans: BiilingPlan[];
  public operatorDisable = false;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ["", Validators.required],
    toDate: ["", Validators.required],
  });
  filterValue: any = {};
  deleteBillingData: any;
  exportBillingPlanExcel = [];
  getPdfData: any;

  constructor(
    private billingPlanService: BillingPlanService,
    private authService: AuthService,
    private toastyService: ToastyService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private driverService: DriverService,
    config: NgbDatepickerConfig,
    private fb: FormBuilder
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
  }

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          // console.log("test");
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
  generatePdf() {
    // import 'jspdf-autotable';

    this.loading = true;
    this.billingPlanService.getAllBillingPlansPDF().subscribe(
      (respone) => {
        this.getPdfData = respone.data;
        //  this.jsonObj = respone.data;
        //  console.log("getPdfData",this.getPdfData)
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
    const header = [["name", "details", "chargeAmt", "billingType"]];
    const rows = [];

    const data = this.getPdfData;
    //  console.log("data",data)

    data.forEach((elm) => {
      const temp = [
        elm.name,
        elm.details,
        elm.chargeAmt,
        elm.billingType,
        elm.creditBalance,
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

    downloadPDF.save("Billiing_paln-data.pdf");
  }

  exportAsXLSX() {
    // console.log("log")
    this.billingPlanService
      .listAllBillingPlans({ filter: this.filterValue })
      .subscribe(
        (resp) => {
          resp.data.map((element) => {
            this.exportBillingPlanExcel.push({
              Name: element.name,
              Details: element.details,
              "Charge Amount": element.chargeAmt,
              BillingType: element.billingType,
            });
          });
          this.excelService.exportAsExcelFile(
            this.exportBillingPlanExcel,
            "BillingPlanDetails"
          );

          this.exportBillingPlanExcel = [];
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

  onDelete(id) {
    this.loading = true;

    let recycled = {
      id: id,
    };
    this.billingPlanService.deleteBillingPlan(recycled).subscribe(
      (next) => {
        this.deleteBillingData = next.data;
        if (next.status_code == 200) {
          this.addToast({
            title: "Success",
            msg: next.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "success",
          });
          this.rerender();
          this.loading = false;
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
  initlist() {
    let admindata = JSON.parse(localStorage.getItem("adminData"));
    if (admindata.type == "operator") {
      this.operatorDisable = true;
    } else {
      this.operatorDisable = false;
    }
    this.loading = true;
    this.authService.clearDataTableData("DataTables_billing_plan_management");
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: false,
      stateSave: true,
      stateSaveCallback: function (settings, data) {
        localStorage.setItem(
          "DataTables_billing_plan_management",
          JSON.stringify(data)
        );
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(
          localStorage.getItem("DataTables_billing_plan_management")
        );
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        );
        console.log("test3", dataTablesParameters);
        this.billingPlanService
          .listAllBillingPlans(dataTablesParameters)
          .subscribe(
            (resp) => {
              // console.log("test3");

              this.loading = false;
              this.billingPlans = resp.data;
              var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
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
        { data: "name" },
        { data: "details" },
        { data: "chargeAmt", searchable: false },
        { data: "billingType" },
        { data: "actions", orderable: false, searchable: false },
      ],
    };
  }
  ngOnInit() {
    
    this.initlist();
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

  operatorPermission() {
    Swal({
      title: "Alert",
      text: "You do not have a permission edit info",
      type: "info",
      showCloseButton: true,
      showCancelButton: false,
    }).then((willDelete) => {});
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[10].getElementsByTagName("li")[0].className = "ng-star-inserted active"
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
