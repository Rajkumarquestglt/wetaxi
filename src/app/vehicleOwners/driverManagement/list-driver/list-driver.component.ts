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
import { AuthService, DriverService } from "src/app/demo/services";
import { SettingService } from "src/app/demo/services/setting.service";
import { ExcelService } from "src/app/demo/services/excel.service";

@Component({
  selector: "list-driver",
  templateUrl: "./list-driver.component.html",
})
export class ListDriverComponent implements AfterViewInit, OnInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  drivers = [];
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
  public StartData = 1;
  badge = 0;
  driverlist = [];
  driverlis = [{id:"asdfghjkl"}];
  // drivers;
  constructor(
    private driverService: DriverService,
    private toastyService: ToastyService,
    private authService: AuthService,

    private settingService: SettingService,
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
  ngOnInit() {
    // Menu Active process Start
    //  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    //  {
    //    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    //  }
    //  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[2].getElementsByTagName("li")[0].className = "ng-star-inserted active"
    // menu Active Process End
    this.admin_id = JSON.parse(localStorage.getItem("adminData"));
    this.getLowBalance();
    this.profilePhotoUrl = environment.profileImageUrl;
    this.authService.clearDataTableData("DataTables_driver_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, "desc"],
      serverSide: true,
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
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        dataTablesParameters.filter = this.filterValue;
        // this.driverService.vehicleRequestList(dataTablesParameters).subscribe((resp) => {
        //   this.badge = resp.data.allRequest.length>0 ?resp.data.allRequest.length:0;
        //   // console.log(resp.data.allRequest);
        // })
        this.driverService.vehicleRequestList(dataTablesParameters).subscribe(
          (resp) => {
            this.loading = false;
            this.drivers = resp.data.allRequest;
            this.badge = 0;
            this.driverlist = [];
            // localStorage.setItem("driverlist",JSON.stringify(this.drivers));
            var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            for(var j = this.drivers.length-1; j >= 0;j--){
              if(!this.drivers[j].isApproved){
                this.drivers.splice(j,1);
                this.badge += 1;
              }
            }
            console.log(this.drivers);
            this.driverlist = this.drivers.length > 0 ? [] : this.driverlis; 
            // for (let index = 0; index < this.drivers.length; index++) {
            //   if (this.balanceData >= this.drivers[index].creditBalance) {
            //     this.drivers[index].isSame = true;
            //   } else {
            //     this.drivers[index].isSame = false;
            //   }
            // }
            // for (let index = 0; index < this.drivers.length; index++) {
            //   if (moment().format('D') == moment(this.drivers[index].dob).format('D') && moment().format('MMMM') == moment(this.drivers[index].dob).format('MMMM')) {
            //     this.drivers[index].isSelected = true;
            //   } else {
            //     this.drivers[index].isSelected = false;
            //   }
            // }
            callback({
              recordsTotal: resp.data.allRequest?resp.data.allRequest.length:0,
              recordsFiltered:
                resp.data.allRequest?resp.data.allRequest.length:0,
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
        { data: "StartData",searchable:false,orderable:false},
        { data: "driverData.name" },
        { data: "driverData.phoneNumber" },
        { data: "vehiclelData.model"},
        { data: "vehicleData.platNumber"},
        // { data: "type" },
        // { data: "avgRating" },
        // { data: "creditBalance" },
        // { data: "dob", searchable: false },
        // { data: "createdAt", searchable: false },
        // { data: "profilePhoto", orderable: false },
        // { data: "isVerified", orderable: false, searchable: false },
        { data: "currentDriverAssign", searchable: false, orderable: false },

        // { data: "actions", orderable: false, searchable: false },
        // { data: "refferal earning actions", orderable: false, searchable: false },
        // { data: "ride actions", orderable: false, searchable: false }
      ],
    };
    // this.generatePdf();
  }
  handleWarning(id) {
    console.log(id);
    let data={
      "vehicleId":id
    }
    this.loading = true;

    this.driverService.SendWarning(data).subscribe(
      (resp) => {
        this.loading = false;
        if(resp.status_code == 200)
        {
          this.addToast({
            title: "Success",
            msg: resp.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "success",
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
  handleConfirm(id) {
    console.log(id);
    let data={
      "vehicleId":id
    }
    this.loading = true;

    this.driverService.ConfirmFreeVehicle(data).subscribe(
      (resp) => {
        this.loading = false;
        this.rerender()
        if(resp.status_code == 200)
        {
          this.addToast({
            title: "Success",
            msg: resp.message,
            timeout: 5000,
            theme: "default",
            position: "bottom-right",
            type: "success",
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
  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + "default.png";
  }

  levelnotfound() {
    Swal({
      title: "Bottom line !!",
      type: "info",
      showCloseButton: true,
      showCancelButton: false,
    }).then((willDelete) => {});
  }
  onChangebtn(id, status) {
    let deleted = {
      id: id,
      status: status,
    };
    console.log("recycled", deleted);
    this.driverService.changeDriverStatus(deleted).subscribe((respone) => {
      this.driverData = respone;

      console.log("recycleData", this.driverData);
      // this.getAllUsers();
    });
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
    // this.driverService.vehicleRequestList({ filter: this.filterValue }).subscribe(
    //   (resp) => {
        var i = 0;
        this.drivers.map((element) => {
          if(element.isApproved){
            i+=1;
            this.exportDriverExcel.push({
              "No": i,
              "Current Driver": element.driverData.name,
              "Phone": element.driverData.phoneNumber,
              "Car Model": element.vehicleData.model,
              "Plate No": element.vehicleData.platNumber
              // "Car Type": element.avgRating,
            });
          }
        });
        this.loading = false;

        this.excelService.exportAsExcelFile(
          this.exportDriverExcel,
          "Current DriverList"
        );
        this.exportDriverExcel = [];
      // },
      // (error) => {
      //   this.loading = false;
      //   this.addToast({
      //     title: "Error",
      //     msg: error.message,
      //     timeout: 5000,
      //     theme: "default",
      //     position: "bottom-right",
      //     type: "error",
      //   });
      // }
    // );
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
      fromDate: fromDate.month+"-"+fromDate.day+"-"+fromDate.year,
      toDate: toDate.month +"-"+toDate.day+"-"+toDate.year
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
