import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService, DriverService } from 'src/app/demo/services';
import { SettingService } from 'src/app/demo/services/setting.service';
import { ExcelService } from 'src/app/demo/services/excel.service';

@Component({
  selector: 'driver-request',
  templateUrl: './driver-request.component.html'
})
export class ListDriverRequestComponent implements AfterViewInit, OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
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
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  getAllDriverPDF: any;
  jsonObj: any;
  driverData: any;
  public startData=1;
  public badge = 0;
  constructor(
    private driverService: DriverService,
    private toastyService: ToastyService,
    private authService: AuthService,

    private settingService: SettingService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
  }
   ngOnInit() {
     // Menu Active process Start
    //  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    //  {
    //    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    //  }
    //  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[2].getElementsByTagName("li")[0].className = "ng-star-inserted active"
     // menu Active Process End
    this.admin_id = JSON.parse(localStorage.getItem('adminData'));
    this.getLowBalance();
    this.profilePhotoUrl = environment.profileImageUrl;
    this.authService.clearDataTableData("DataTables_driver_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, 'desc'],
      serverSide: true,
      processing: false,
      stateSave: true,
      dom: 'lrtip',
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
        this.driverService.vehicleRequestList(dataTablesParameters).subscribe(
          resp => {
            this.loading = false;
            this.drivers = resp.data.allRequest;
            var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            for(var j = this.drivers.length-1; j >= 0;j--){
              if(this.drivers[j].isApproved){
                this.drivers.splice(j,1);
              }
            }
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
              recordsTotal: resp.data.allRequest.length,
              recordsFiltered: resp.data.allRequest.length,
              data: []
            });
          },
          error => {
            this.loading = false;
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          }
        );
      },
      columns: [
        { data: "startData",searchable: false ,orderable: false},
        { data: "uniqueID", orderable: true ,searchable: false},
        { data: "profilePhoto",searchable: false , orderable: false},
        { data: "name", searchable: false },
        { data: "phoneNumber",searchable: false },
        { data: "model",searchable: false },
        { data: "platNumber" ,searchable: false},
        // { data: "avgRating" },
        // { data: "creditBalance" },
        // { data: "dob", searchable: false },
        // { data: "createdAt", searchable: false },
        // { data: "profilePhoto", orderable: false },
        // { data: "status",  searchable: false },
        { data: "actions", orderable: false, searchable: false },
        // { data: "refferal hierarchy actions", orderable: false, searchable: false },
        // { data: "refferal earning actions", orderable: false, searchable: false },
        // { data: "ride actions", orderable: false, searchable: false }
      ]
    };
    // this.generatePdf();
  }
  
  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + 'default.png';
  }

  levelnotfound() {
    Swal({
      title: 'Bottom line !!',
      type: 'info',
      showCloseButton: true,
      showCancelButton: false
    }).then((willDelete) => {
    });
  }
  onChangebtn(id,status){
    let deleted = {
      'id': id,
      'status': status

      }
    console.log("recycled",deleted)
    this.driverService
    .changeDriverStatus(deleted)
    .subscribe(respone => {
      this.driverData = respone;

      console.log("recycleData", this.driverData);
      // this.getAllUsers();

    });

  }
  getLowBalance() {
    this.loading = true;
    let demo = "admin Fee";
    this.settingService.GetAdminFee(demo).subscribe(
      respone => {
        this.loading = false;
        this.balanceData = respone.data.driverMinimumBalance;
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }


  generatePdf() 
   { 
    this.loading = true;
    this.driverService.getAllDriverPDF().subscribe(
      respone => {
      
        this.getAllDriverPDF = respone.data;
        this.jsonObj = respone.data;
        console.log("getAllDriverPDF",this.getAllDriverPDF)
      //  this.data();
       this.exportDriverDataToPdf();
       
      },
      
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
   
   } 

  exportDriverDataToPdf(){

const downloadPDF = new jsPDF();
const header = [['autoIncrementID', 'uniqueID', 'name', 'PhoneNumber', 'creditBalance', 'totalRideEarning', 'createdAt']];
const rows=[];
   

        const data = this.getAllDriverPDF;
        console.log("data",data)
       
      
        data.forEach(elm => {
           const temp = [elm.autoIncrementID, elm.uniqueID,elm.name,elm.onlyPhoneNumber,elm.creditBalance,elm.totalRideEarning,elm.createdAt  ];
           rows.push(temp);
          //  console.log('Rows', rows); // showing all data
         });

        //  @ts-ignore
        downloadPDF.autoTable({
          head: header,
          body: rows,
        });
      
        this.loading = false;
 
        downloadPDF.save('Driver data.pdf');

   }

  exportAsXLSX_Driver() {
    
    this.loading = true;
    // this.driverService.ListOfAllDrivers({ filter: this.filterValue }).subscribe(
    //   resp => {
      var i = 0;
        this.drivers.map(element => {
          i+=1;
          console.log(this.drivers);
          this.exportDriverExcel.push({
            'No': i,
            'Driver ID': element.driverData.uniqueID,
            'Name': element.driverData.name,
            'Phone': element.driverData.phoneNumber,
            'Model': element.vehicleData.model,
            'Plat Number': element.vehicleData.platNumber,
          })
        });
        this.loading = false;

        this.excelService.exportAsExcelFile(this.exportDriverExcel, 'Driver Request List');
        this.exportDriverExcel =[];
    //   },
    //   error => {
    //     this.loading = false;
    //     this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
    //   }
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
      onAdd: (toast: ToastData) => {
      },
      onRemove: (toast: ToastData) => {
      }
    };

    switch (options.type) {
      case 'default': this.toastyService.default(toastOptions); break;
      case 'info': this.toastyService.info(toastOptions); break;
      case 'success': this.toastyService.success(toastOptions); break;
      case 'wait': this.toastyService.wait(toastOptions); break;
      case 'error': this.toastyService.error(toastOptions); break;
      case 'warning': this.toastyService.warning(toastOptions); break;
    }
  }

  blockUnblockDriver(driver: any) {
    let text;
    if (driver.isBlocked) {
      text = 'You want to unblock this driver ?';
    } else {
      text = 'You want to block this driver ?';
    }

    Swal({
      title: 'Are you sure?',
      text: text,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete && !willDelete.dismiss) {
        let data = {
          'driver_id': driver._id
        }
        this.driverService.blockUnblockDriver(data).subscribe(
          next => {
            if (next.status_code == 200) {
              this.rerender();
              if (driver.isBlocked) {
                Swal('Success', "Driver unblocked successfully.", 'success');
              } else {
                Swal('Success', "Driver blocked successfully.", 'success');
              }
            } else {
              Swal('Success', "Driver status is not updated.", 'success');
            }
          },
          error => {
            Swal('Success', "Driver status is not updated.", 'success');
          }
        );
      } else {
      }
    });
  }
  acceptDriver(driver:any){
    let text;
    if (!driver.isApproved) {
      text = 'You want to Accept this Drive Request ?';
    } else{
      text = 'You want to reject this Drive Request ?';
    }

    Swal({
      title: 'Are you sure?',
      text: text,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete && !willDelete.dismiss) {
        let data = {
          'requestId': driver._id,
          'driverId':driver.driverId,
          'status':"approve"
        }
        this.driverService.acceptRejectRequest(data).subscribe(
          next => {
            if (next.status_code == 200) {
              this.rerender();
              if (driver.isApproved) {
                Swal('Success', "Drive Request accepted successfully.", 'success');
              } else {
                Swal('Success', "Drive Request accepted successfully.", 'success');
              }
            } else {
              Swal('Error', "Drive Request status is not updated.", 'error');
            }
          },
          error => {
            Swal('Error', "Drive Request status is not updated.", 'error');
          }
        );
      } else { }
    });
  }
  rejectDriver(driver:any){
    let text;
    if (driver.isApproved) {
      text = 'You want to Accept this Drive Request ?';
    } else{
      text = 'You want to reject this Drive Request ?';
    }

    Swal({
      title: 'Are you sure?',
      text: text,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete && !willDelete.dismiss) {
        let data = {
          'requestId': driver._id,
          'driverId':driver.driverId,
          'status':"reject"
        }
        this.driverService.acceptRejectRequest(data).subscribe(
          next => {
            if (next.status_code == 200) {
              this.rerender();
              if (driver.isApproved) {
                Swal('Success', "Drive Request rejected successfully.", 'success');
              } else {
                Swal('Success', "Drive Request rejected successfully.", 'success');
              }
            } else {
              Swal('Error', "Drive Request status is not updated.", 'error');
            }
          },
          error => {
            Swal('Error', "Drive Request status is not updated.", 'error');
          }
        );
      } else { }
    });
  }
  verifyUnverifyDriver(driver: any) {
    let text;
    if (driver.isVerified) {
      text = 'You want to unverify this driver ?';
    } else {
      text = 'You want to verify this driver ?';
    }

    Swal({
      title: 'Are you sure?',
      text: text,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete && !willDelete.dismiss) {
        let data = {
          'driver_id': driver._id,
          'admin_id': this.admin_id.admin_id
        }
        this.driverService.verifyUnverifyDriver(data).subscribe(
          next => {
            if (next.status_code == 200) {
              this.rerender();
              if (driver.isVerified) {
                Swal('Success', "Driver status unverified successfully.", 'success');
              } else {
                Swal('Success', "Driver status verified successfully.", 'success');
              }
            } else {
              Swal('Success', "Driver status is not updated.", 'success');
            }
          },
          error => {
            Swal('Error', "Driver status is not updated", 'error');
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

    if (this.filterForm.status == "INVALID")
      return;

    let { fromDate, toDate } = this.filterForm.value;

    this.filterValue = {
      fromDate: moment().year(fromDate.year).month(fromDate.month - 1).date(fromDate.day).hours(0).minutes(0).seconds(0).milliseconds(0).toISOString(),
      toDate: moment().year(toDate.year).month(toDate.month - 1).date(toDate.day).hours(23).minutes(59).seconds(59).milliseconds(999).toISOString()
    };

    this.rerender();
  }

  resetFilter() {
    this.submitted = false;
    this.filterValue = {}
    this.filterForm.reset();
    this.rerender();
  }

}

