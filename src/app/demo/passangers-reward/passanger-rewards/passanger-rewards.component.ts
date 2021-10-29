import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DriverService, AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { SettingService } from '../../services/setting.service';
import { NotifyService } from '../../services/notify.service';


// class Driver {
//   Id: number;
//   first_name: string;
//   last_name: string;
// }

// class DataTablesResponse {
//   data: any[];
//   draw: number;
//   recordsFiltered: number;
//   recordsTotal: number;
// }
@Component({
  selector: 'app-passanger-rewards',
  templateUrl: './passanger-rewards.component.html'
})
export class PassangerRewardsComponent implements OnInit {


  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  drivers:any;
  profilePhotoUrl: any;
  balanceData: any;
  isSubmitted: boolean = false;
  isAllSubmitted: boolean = false;
  checkedList=[];
  public masterSelected = false;
  public DeleteDisabled = false;
  statusList = [];
  title: any;
  description: any;
  type: any;
  _id: any;
  id: any; 
  rewardDetails: any;
  media: any;
  constructor(
    private driverService: DriverService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private settingService: SettingService,
    private notifyService: NotifyService,

  ) { }
  getRewardDetails(id){
    this.loading=true;
    // let dataParam={
    //   'notificationId':id
    // }
    // console.log("dataParam",dataParam)
    this.notifyService.getRewardDetails(id).subscribe(next => {
     this.loading=false;
      console.log("next---------->",next.data);
      this.id=next.data;
      this.title=next.data.title;
      this.description=next.data.description;
      this.type=next.data.type;
      this._id=next.data._id;
      this.media=next.data.media;
      // this.viewNotificationForm.controls['title'].setValue(next.data.title);
      // this.viewNotificationForm.controls['description'].setValue(next.data.description);
      // this.viewNotificationForm.controls['type'].setValue(next.data.type);
      // this.viewNotificationForm.controls['media'].setValue(next.data.media);
      // this.notificationForm.patchValue({
      //   title:next.data.title,
      //   description:next.data.description,
      //   type:next.data.type,

      // })
      


   });
  }
  ngOnInit() {
    
    this.notifyService.getAllRewardList1().subscribe(
      resp => {
        this.loading = false;
        this.rewardDetails = resp.data.data[0].rewardList;
      });
      let url = window.location.href.split("/")
      let url_id = url[url.length-1];
console.log(url_id)
      this.getRewardDetails(url_id);
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
        let url = window.location.href.split("/")
        let url_id = url[url.length-1];
        dataTablesParameters.rewardId=url_id;
        this.driverService.getPassengerListFromReward(dataTablesParameters).subscribe(
          resp => {
            this.loading = false;
            console.log("resp",resp)
            this.drivers = resp.data[0].passengerList;
            var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            for (let index = 0; index < this.drivers.length; index++) {
              if (this.balanceData >= this.drivers[index].creditBalance) {
                this.drivers[index].isSame = true;
              } else {
                this.drivers[index].isSame = false;
              }
            }
            for (let index = 0; index < this.drivers.length; index++) {
              if (moment().format('D') == moment(this.drivers[index].dob).format('D') && moment().format('MMMM') == moment(this.drivers[index].dob).format('MMMM')) {
                this.drivers[index].isSelected = true;
              } else {
                this.drivers[index].isSelected = false;
              }
            }
            callback({
              recordsTotal: resp.data[0].passengerList.length,
              recordsFiltered: resp.data[0].rewardCount[0].totalCount,
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
        { data: "checkid", orderable: false,searchable: false },
        { data: "autoIncrementID" },
        
        { data: "name" },

        { data: "profilePhoto", orderable: false,searchable: false },
      
        { data: "onlyPhoneNumber" },
       
        { data: "actions", orderable: false, searchable: false }
      ]
    };
  }
  checkUncheckAll() {
    for (var i = 0; i < this.drivers.length; i++) {
      this.drivers[i].isCheck = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  isAllSelected() {
    this.masterSelected = this.drivers.every(function (item: any) {
      return item.isCheck == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.drivers.length; i++) {
      if (this.drivers[i].isCheck)
        this.checkedList.push(this.drivers[i]._id);
    }
    this.checkedList =this.checkedList;
    if (this.checkedList.length > 0) {
      this.DeleteDisabled = false;
    } else {
      this.DeleteDisabled = true;
    }
    this.statusList = this.checkedList;
  }
  onFormSubmit() {
    
    this.isSubmitted = true;
      this.loading = true;
      let senddata = {title: this.title,description: this.description,type:this.type ,media:this.media, rewardId:this._id,passengerIdList: this.checkedList }
      console.log("senddata",senddata)
      this.notifyService.sendRewardToPassengerList(senddata)
        .subscribe(next => {
          this.loading = false;
          this.isSubmitted = false;
          if (next.status == 200) {
            // this.modalDefault.hide();
            this.addToast({ title: 'Success', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'success' });
            // this.notificationForm.reset();
            this.rerender();
          } else {
            this.addToast({ title: 'Error', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          }
        },
          error => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          })
    
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
  imgErrorHandler(event){
    event.target.src = this.profilePhotoUrl + 'default.png';
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
          'driver_id': driver._id
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
    // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[18].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }


}
