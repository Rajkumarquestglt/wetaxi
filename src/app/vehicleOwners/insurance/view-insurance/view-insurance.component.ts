import {
    Component,
    OnInit,
    ViewChild,
    AfterViewInit,
    ElementRef,
  } from "@angular/core";
  import { DataTableDirective } from "angular-datatables";
  import { Subject } from "rxjs";
  import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
  import { environment } from "src/environments/environment";
  import Swal from "sweetalert2";
  import * as moment from "moment";
  import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
  import { FormBuilder, Validators } from "@angular/forms";
  import * as jsPDF from "jspdf";
  import "jspdf-autotable";
  
  import { ExcelService } from "src/app/demo/services/excel.service";
  import { DriverService } from 'src/app/demo/services';
  
  @Component({
    selector: "view-insurance",
    templateUrl: "./view-insurance.component.html",
  })
  export class ViewInsuranceComponent implements AfterViewInit, OnInit {
    public loading = false;
    public primaryColour = "#ffffff";
    public secondaryColour = "#ffffff";
    position = "bottom-right";
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    drivers;
    exportDriverExcel = [];
    profilePhotoUrl: any;
    admin_id: any;
    balanceData: any;
    submitted = false;
    filterForm = this.fb.group({
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
    });
    filterValue: any = {};
    getAllDriverPDF: any;
    jsonObj: any;
    driverData: any;
    constructor(
      private driverService: DriverService,
      private toastyService: ToastyService,
  
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
    ngOnInit() {}
  
    imgErrorHandler(event) {
      event.target.src = this.profilePhotoUrl + "default.png";
    }
  
    generatePdf() {
      this.loading = true;
      this.driverService.getAllDriverPDF().subscribe(
        (respone) => {
          this.getAllDriverPDF = respone.data;
          this.jsonObj = respone.data;
          console.log("getAllDriverPDF", this.getAllDriverPDF);
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
          "autoIncrementID",
          "uniqueID",
          "name",
          "PhoneNumber",
          "creditBalance",
          "totalRideEarning",
          "createdAt",
        ],
      ];
      const rows = [];
  
      const data = this.getAllDriverPDF;
      console.log("data", data);
  
      data.forEach((elm) => {
        const temp = [
          elm.autoIncrementID,
          elm.uniqueID,
          elm.name,
          elm.onlyPhoneNumber,
          elm.creditBalance,
          elm.totalRideEarning,
          elm.createdAt,
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
  
      downloadPDF.save("Driver data.pdf");
    }
  
    exportAsXLSX_Driver() {
      this.loading = true;
      this.driverService.ListOfAllDrivers({ filter: this.filterValue }).subscribe(
        (resp) => {
          resp.data.map((element) => {
            this.exportDriverExcel.push({
              VehicleId: element.uniqueID,
              Email: element.email,
              Name: element.name,
              CountryCode: element.countryCode,
              PhoneNumber: element.onlyPhoneNumber,
              Ratting: element.avgRating,
              credit: element.creditBalance,
              Status: element.isVerified ? "Verify" : "Unverify",
              DateOfBirth: element.dob,
              RegisterDate: moment(element.createdAt).format("YYYY-MM-DD"),
              TotalInvitedCount: element.totalInvitedCount,
              TotalReferralEarning: element.totalReferralEarning,
              TotalRideEarning: element.totalRideEarning,
            });
          });
          this.loading = false;
  
          this.excelService.exportAsExcelFile(
            this.exportDriverExcel,
            "DriverDetails"
          );
          this.exportDriverExcel = [];
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
  
    blockUnblockDriver(driver: any) {
      let text;
      if (driver.isBlocked) {
        text = "You want to unblock this driver ?";
      } else {
        text = "You want to block this driver ?";
      }
  
      Swal({
        title: "Are you sure?",
        text: text,
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
      }).then((willDelete) => {
        if (willDelete && !willDelete.dismiss) {
          let data = {
            driver_id: driver._id,
          };
          this.driverService.blockUnblockDriver(data).subscribe(
            (next) => {
              if (next.status_code == 200) {
                this.rerender();
                if (driver.isBlocked) {
                  Swal("Success", "Driver unblocked successfully.", "success");
                } else {
                  Swal("Success", "Driver blocked successfully.", "success");
                }
              } else {
                Swal("Success", "Driver status is not updated.", "success");
              }
            },
            (error) => {
              Swal("Success", "Driver status is not updated.", "success");
            }
          );
        } else {
        }
      });
    }
  
    verifyUnverifyDriver(driver: any) {
      let text;
      if (driver.isVerified) {
        text = "You want to unverify this driver ?";
      } else {
        text = "You want to verify this driver ?";
      }
  
      Swal({
        title: "Are you sure?",
        text: text,
        type: "warning",
        showCloseButton: true,
        showCancelButton: true,
      }).then((willDelete) => {
        if (willDelete && !willDelete.dismiss) {
          let data = {
            driver_id: driver._id,
            admin_id: this.admin_id.admin_id,
          };
          this.driverService.verifyUnverifyDriver(data).subscribe(
            (next) => {
              if (next.status_code == 200) {
                this.rerender();
                if (driver.isVerified) {
                  Swal(
                    "Success",
                    "Driver status unverified successfully.",
                    "success"
                  );
                } else {
                  Swal(
                    "Success",
                    "Driver status verified successfully.",
                    "success"
                  );
                }
              } else {
                Swal("Success", "Driver status is not updated.", "success");
              }
            },
            (error) => {
              Swal("Error", "Driver status is not updated", "error");
            }
          );
        } else {
        }
      });
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
  