import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { PromotionCodeService } from "../../services/promotion-code.service";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import { Router } from "@angular/router";

// import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";
import * as moment from "moment";
// import { ExcelService } from '../../services/excel.service';
import {
  NgbDatepickerConfig,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService, DriverService } from "../../services";
import { ExcelService } from "../../services/excel.service";
import { environment } from "src/environments/environment";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
@Component({
  selector: "list-promotion-code",
  templateUrl: "./list-promotion-code.component.html",
})
export class ListPromotionCodeComponent implements AfterViewInit, OnInit {
  title = "appBootstrap";

  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isSubmitted: boolean = false;

  promotions;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ["", Validators.required],
    toDate: ["", Validators.required],
  });
  filterValue: any = {};
  getPromotionListExcel: [];
  exportActionLogExcel: any[];
  promotionCodeDel: any;
  profilePhotoUrl: string;
  getPdfData: any;
  exportExcelData = [];
  startData=1;

  constructor(
    private router: Router,

    private promotionCodeService: PromotionCodeService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private driverService: DriverService
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
  }

  ngOnInit() {
    // Menu Active process Start
  // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
  // {
  //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
  // }
  // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[5].getElementsByTagName("li")[0].className = "ng-star-inserted active"
  // menu Active Process End
    this.profilePhotoUrl = environment.profileImageUrl;
    this.list();
  }
  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + "default.png";
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

  onDelete(id) {
    this.loading = true;
    let recycled = {
      couponId: id,
    };
    this.promotionCodeService.deletePromotionCode(recycled).subscribe(
      (next) => {
        this.loading = false;
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
  generatePdf() {
    // import 'jspdf-autotable';

    this.loading = true;
    this.promotionCodeService.getPromotionListPDF().subscribe(
      (respone) => {
        this.getPdfData = respone.data;
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
        "Code",
        "promotionCodeType",
        "discount",
        "startDate",
        "expireDate",
        "isActive",
      ],
    ];
    const rows = [];

    const data = this.getPdfData;
    console.log("data", data);

    data.forEach((elm) => {
      const temp = [
        elm.Code,
        elm.promotionCodeType,
        elm.discount,
        elm.startDate,
        elm.expireDate,
        elm.isActive,
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

    downloadPDF.save("promotion-code-data.pdf");
  }

  exporExcel() {
    // console.log("log")
    this.promotionCodeService.getPromotionListExport().subscribe(
      (resp) => {
        console.log("log", resp.data.AllPromocode);

        resp.data.AllPromocode.map((element) => {
          this.exportExcelData.push({
            code: element.code,
            promotionCodeType: element.promotionCodeType,
            discount: element.discount,
            startDate: element.startDate,
            expireDate: element.expireDate,
            isActive: element.isActive,
          });
        });
        this.excelService.exportAsExcelFile(
          this.exportExcelData,
          "Promotion Code"
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

  list() {
    this.authService.clearDataTableData("DataTables_promotion_code");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, "desc"],
      serverSide: true,
      processing: true,
      stateSave: true,
      // destroy: true,
      stateSaveCallback: function (settings, data) {
        localStorage.setItem("DataTables_promotion_code", JSON.stringify(data));
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_promotion_code"));
      },

      ajax: (dataTablesParameters: any, callback) => {
        console.log(dataTablesParameters);
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        );
        dataTablesParameters.filter = this.filterValue;
        this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
        this.promotionCodeService
          .getPromotionList(dataTablesParameters)
          .subscribe(
            (resp) => {
              this.loading = false;
              this.promotions = resp.data.AllPromocode;
              var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
              //  console.log("this.promotions",this.promotions[1]._id)
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
        { data: "_id" },
        { data: "code" },
        { data: "promotionCodeType" },
        { data: "discount" },
        { data: "startDate" },
        { data: "expireDate" },
        { data: "isActive" },
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

  ngAfterViewInit(): void {
    this.dtTrigger.next();
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
