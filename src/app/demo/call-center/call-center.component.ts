import { Component, OnInit } from '@angular/core';
import { SettingService } from '../services/setting.service';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-call-center',
  templateUrl: './call-center.component.html'

})
export class CallCenterComponent implements OnInit {
  public basicContent: string;
  public loading = false;
  action: string = 'view';
  position = 'bottom-right';
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  isSubmitted: boolean = false;
  extension: any;
  termData: any;
  feeData: any = {};
  _id: any;
  constructor(
    private settingService: SettingService,
    private toastyService: ToastyService,
   
  ) { }
  updateTermAndConditionData() {
    
    this.loading = true;

    let update_term_and_condition = {
      'termAndCondition': this.basicContent,
      'id':this._id
    }
    this.settingService.updateCallCenterData(update_term_and_condition)
      .subscribe(next => {
        // console.log("next",next.data)
        this.loading = false;
        this.isSubmitted = false;


        if (next.status_code == 200) {
          this.addToast({ title: 'Success', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'success' });
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
  GetTermAndConditionData() {
    this.loading = true;
    this.settingService.getCallCenterData().subscribe(
      respone => {
        this.loading = false;
        // console.log("this.termData",respone)

        this.termData = respone.data;

        this.basicContent = this.termData.termAndCondition;
        this._id=this.termData._id;
        // console.log("this.termData",this._id)
      
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
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
  ngOnInit() {
    // Menu Active process Start
  // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
  // {
  //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
  // }
  // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[7].getElementsByTagName("li")[0].className = "ng-star-inserted active"
  // menu Active Process End
    this.GetTermAndConditionData();
  }

}
