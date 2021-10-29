import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AuthService, DriverService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { SettingService } from '../../services/setting.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {LocationService} from "../../services/location.service"
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../services/excel.service';
@Component({
  selector: 'list-driver-location',
  templateUrl: './list-driver-location.component.html',
  // template:`<app-view-driver-location [parentCount]="primaryColour"></app-view-driver-location>`
})
export class ListDriverLocationComponent implements OnInit {
  public id: string;
  public location;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild('closeBtn') closeBtn;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  drivers;
  profilePhotoUrl: any;
  balanceData: any;
  isSubmitted: boolean = false;
  isAllSubmitted: boolean = false;
  isclosebutton: boolean = false;
  public masterSelected = false;
  public DeleteDisabled = false;
  checkedList: any;
  statusList = [];
  locationForm: FormGroup;
  locationForms: FormGroup;
  profileImageUrl: any;
  @ViewChild('modalDefault1') modalDefault1;
  @ViewChild('modalDefault') modalDefault;
  driverDetails: any;
  getPdfData: any;
  exportDriverLocationExcel=[];
  startData=1;
  constructor(
    private locationService: LocationService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private settingService: SettingService,
    private driverService:DriverService,
    private excelService:ExcelService,
    private activatedRoute: ActivatedRoute
  ) { }
  generatePdf() 
  { 
// import 'jspdf-autotable';

   this.loading = true;
   this.driverService.getAllDriversLocationPDF().subscribe(
     respone => {
     
       this.getPdfData = respone.data.AllDriverLocation;
      //  this.jsonObj = respone.data;
       console.log("getPdfData",this.getPdfData)
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
const header = [['currentLocation', 'name', 'Vehicle ID', 'PhoneNumber', 'createdAt']];
const rows=[];
  

       const data = this.getPdfData;
       console.log("data",data)
      
     
       data.forEach(elm => {
          const temp = [elm.currentLocation, elm.name,elm.vehicle.platNumber,elm.onlyPhoneNumber,elm.createdAt ];
          rows.push(temp);
         //  console.log('Rows', rows); // showing all data
        });

       //  @ts-ignore
       downloadPDF.autoTable({
         head: header,
         body: rows,
       });
     
       this.loading = false;

       downloadPDF.save('Driver-location-data.pdf');

  }

 
  exportDriverLocation() {
    console.log("log")
    this.locationService.getAllDriversLocationPdf().subscribe(
      resp => {
        console.log("log", resp.data.AllDriverLocation)

        resp.data.AllDriverLocation.map(element => {
          this.exportDriverLocationExcel.push({ 'Id': element._id, 'currentLocation': element.currentLocation, 'platNumber': element.platNumber, 'onlyPhoneNumber': element.onlyPhoneNumber,'createdAt': element.createdAt })
        
      
        });
        this.excelService.exportAsExcelFile(this.exportDriverLocationExcel, 'BillingPlanDetails');

          this.exportDriverLocationExcel =[];
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }
  
 
ngOnInit(){
 
    this.profilePhotoUrl = environment.profileImageUrl;


    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, 'desc'],
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log(dataTablesParameters);
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        // dataTablesParameters.filter = this.filterValue;
        this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
        
        this.locationService.getAllDriversLocation(dataTablesParameters).subscribe(
          resp => {
            this.loading = false;
            this.location = resp.data.AllDriverLocation;
            var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            // console.log("  this.location",  resp)
            callback({
              recordsTotal: resp.data.AllDriverLocation.length, 
              recordsFiltered: resp.data.AllDriverLocation.length,
              data: []
            });
          
          },
          error => {
            this.loading = false;
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          });
       
      },
      columns: [
        { data: "_id" },
        { data: "currentLocation", },
        { data: "profilePhoto", orderable:false },
        { data: "name" },
        { data: "platNumber" },
        { data: "onlyPhoneNumber" },
        { data: "createdAt",  },
        { data: "action", orderable:false }
      ]
    };



  
}

//   ngOnInit() {
//    // alert("ok");
// this.authService.clearDataTableData("DataTables_driver_management");
//     this.loading = true;
//     this.dtOptions = {
//       pagingType: "full_numbers",
//       pageLength: 10,
//       order: [1, "desc"],
//       serverSide: true,
//       processing: false,
//       stateSave: true,
//       stateSaveCallback: function (settings, data) {
//         localStorage.setItem(
//           "DataTables_driver_management",
//           JSON.stringify(data)
//         );
//       },
//       stateLoadCallback: function (settings) {
//         return JSON.parse(localStorage.getItem("DataTables_driver_management"));
//       },
//       ajax: (dataTablesParameters: any, callback) => {
//         dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
//         this.locationService.getAllDriversLocation().subscribe(
//           resp => {
//             this.loading = false;
//             this.drivers = resp.data;
//             console.log(" this.drivers", this.drivers)
          
           
//             callback({
//               recordsTotal: resp.recordsTotal,
//               recordsFiltered: resp.recordsFiltered,
//               data: []
//             });
//           },
//           error => {
//             this.loading = false;
//             // this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
//           }
//         );
//       },
//       columns: [
//         { data: "checkid", orderable: false },
//         { data: "autoIncrementID" },
//         { data: "uniqueID", orderable: false },
//         { data: "email" },
//         { data: "name" },
//         { data: "countryCode" },
//         { data: "onlyPhoneNumber" },
//         { data: "avgRating" },
//         { data: "creditBalance" },
//         { data: "dob", searchable: false },
//         { data: "createdAt", searchable: false },
//         { data: "profilePhoto", orderable: false }
//         // { data: "actions", orderable: false, searchable: false }
//       ]
//     };
//   }
  openModal() {
    this.isSubmitted = false;
    this.locationForms.reset();
    this.modalDefault1.show();
  }
  openModals() {
    this.isSubmitted = false;
    this.locationForm.reset();
    this.modalDefault.show();
  }
  // checkUncheckAll() {
  //   for (var i = 0; i < this.drivers.length; i++) {
  //     this.drivers[i].isCheck = this.masterSelected;
  //   }
  //   this.getCheckedItemList();
  // }

  // isAllSelected() {
  //   this.masterSelected = this.drivers.every(function (item: any) {
  //     return item.isCheck == true;
  //   })
  //   this.getCheckedItemList();
  // }

  // getCheckedItemList() {
  //   this.checkedList = [];
  //   for (var i = 0; i < this.drivers.length; i++) {
  //     if (this.drivers[i].isCheck)
  //       this.checkedList.push(this.drivers[i]._id);
  //   }
  //   this.checkedList = JSON.stringify(this.checkedList);
  //   if (this.checkedList.length > 0) {
  //     this.DeleteDisabled = false;
  //   } else {
  //     this.DeleteDisabled = true;
  //   }
  //   this.statusList = JSON.parse(this.checkedList);
  // }
  // getLowBalance() {
  //   this.loading = true;
  //   let demo = "admin Fee";
  //   this.settingService.GetAdminFee(demo).subscribe(
  //     respone => {
  //       this.loading = false;
  //       this.balanceData = respone.data.driverMinimumBalance;
  //     },
  //     error => {
  //       this.loading = false;
  //       this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
  //     }
  //   );
  // }

  // onFormSubmit() {
  //   this.isSubmitted = true;
  //   if (this.locationForm.valid) {
  //     this.loading = true;
  //     let senddata = { ...this.locationForm.value, ids: this.checkedList }
  //     // this.notifyService.SendNotificationToDriver(senddata)
  //     //   .subscribe(next => {
  //     //     this.loading = false;
  //     //     this.isSubmitted = false;
  //     //     if (next.status_code == 200) {
  //     //       this.modalDefault.hide();
  //     //       this.addToast({ title: 'Success', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'success' });
  //     //       this.notificationForm.reset();
  //     //     } else {
  //     //       this.addToast({ title: 'Error', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
  //     //     }
  //     //   },
  //         // error => {
  //         //   this.loading = false;
  //         //   this.isSubmitted = false;
  //         //   this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
  //         // })
  //   }
  // }

  // onNotificationFormSubmit() {
  //   this.isAllSubmitted = true;
  //   if (this.notificationForms.valid) {
  //     this.loading = true;
  //     let senddata = { ...this.notificationForms.value, flag: 'all' }
  //     this.notifyService.SendNotificationToDriver(senddata)
  //       .subscribe(next => {
  //         this.loading = false;
  //         this.isAllSubmitted = false;
  //         if (next.status_code == 200) {
  //           this.modalDefault1.hide();
  //           this.addToast({ title: 'Success', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'success' });
  //           this.notificationForms.reset();
  //         } else {
  //           this.addToast({ title: 'Error', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
  //         }
  //       },
  //         error => {
  //           this.loading = false;
  //           this.isAllSubmitted = false;
  //           this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
  //         })
  //   }
  // }
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

  // blockUnblockDriver(driver: any) {
  //   let text;
  //   if (driver.isBlocked) {
  //     text = 'You want to unblock this driver ?';
  //   } else {
  //     text = 'You want to block this driver ?';
  //   }

  //   Swal({
  //     title: 'Are you sure?',
  //     text: text,
  //     type: 'warning',
  //     showCloseButton: true,
  //     showCancelButton: true
  //   }).then((willDelete) => {
  //     if (willDelete && !willDelete.dismiss) {
  //       let data = {
  //         'driver_id': driver._id
  //       }
  //       this.driverService.blockUnblockDriver(data).subscribe(
  //         next => {
  //           if (next.status_code == 200) {
  //             this.rerender();
  //             if (driver.isBlocked) {
  //               Swal('Success', "Driver unblocked successfully.", 'success');
  //             } else {
  //               Swal('Success', "Driver blocked successfully.", 'success');
  //             }
  //           } else {
  //             Swal('Success', "Driver status is not updated.", 'success');
  //           }
  //         },
  //         error => {
  //           Swal('Success', "Driver status is not updated.", 'success');
  //         }
  //       );
  //     } else {

  //     }
  //   });
  // }
  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + 'default.png';
  }
  // verifyUnverifyDriver(driver: any) {
  //   let text;
  //   if (driver.isVerified) {
  //     text = 'You want to unverify this driver ?';
  //   } else {
  //     text = 'You want to verify this driver ?';
  //   }

  //   Swal({
  //     title: 'Are you sure?',
  //     text: text,
  //     type: 'warning',
  //     showCloseButton: true,
  //     showCancelButton: true
  //   }).then((willDelete) => {
  //     if (willDelete && !willDelete.dismiss) {
  //       let data = {
  //         'driver_id': driver._id
  //       }
  //       this.driverService.verifyUnverifyDriver(data).subscribe(
  //         next => {
  //           if (next.status_code == 200) {
  //             this.rerender();
  //             if (driver.isVerified) {
  //               Swal('Success', "Driver status unverified successfully.", 'success');
  //             } else {
  //               Swal('Success', "Driver status verified successfully.", 'success');
  //             }
  //           } else {
  //             Swal('Success', "Driver status is not updated.", 'success');
  //           }
  //         },
  //         error => {
  //           Swal('Error', "Driver status is not updated", 'error');
  //         }
  //       );
  //     } else {

  //     }
  //   });
  // }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
     // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[16].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}
