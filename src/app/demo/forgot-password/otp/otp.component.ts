import { Component, ViewChild,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';
import { Validation } from '../../helper/validation';
import { AuthService } from '../../services';
@Component({
  selector: 'otp',
  templateUrl: './otp.component.html',

})
export class OtpComponent implements OnInit{
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  timeLeft: number = 60;
   minutes = Math.floor(this.timeLeft / 60);
   seconds = this.timeLeft - this.minutes * 60;
  interval;
  position = 'bottom-right';
  isSubmitted: boolean = false;
  otp: string;
  showOtpComponent = true;
  @ViewChild('ngOtpInput') ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '30px',
      'height': '30px'
    }
  };
  constructor(
    private router: Router,
    private validation: Validation,
    private authService: AuthService,
    private toastyService: ToastyService
  ) { }
  ngOnInit() {
    this.startTimer();
    let tempEmail=localStorage.getItem("tempEmail");
    console.log({tempEmail})
    if(!tempEmail){
     
      this.router.navigate(["/forgot-password"]);
    }
  }
  onOtpChange(otp) {
    this.otp = otp;
                                                                                          
  }
  // startTimer() {
  //   this.interval = setInterval(() => {
  //     if(this.timeLeft > 0) {
  //       this.timeLeft--;
  //     } else {
  //       this.timeLeft = 60;
  //     }
  //   },1000)
  // }
  startTimer() {

    this.interval = setInterval(() => {
      
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } 
    },1000)
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
        this.ngOtpInput.otpForm.disable();
      }
    }
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }
  onResendOtpSubmit(){
    this.isSubmitted = true;
    this.loading = true;
    let tempEmail=localStorage.getItem("tempEmail")
    if (tempEmail) {
     let data={
       "email":tempEmail
     }
      this.authService.forgotPassword(data)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              clearInterval(this.interval);
              this.timeLeft=60;
              this.startTimer();
              
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                           
            } else {
              this.addToast({title:'Error', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
            }
          },
          error => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
          })
    }else{
      this.router.navigate(["/forgot-password"]);
    }
  }
  onOtpSubmit(){
    this.isSubmitted = true;
    if (this.otp) {
      this.loading = true;
      
      let data={
        "email":localStorage.getItem("tempEmail"),
        "otp":this.otp
      }
      this.authService.checkOtp(data)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              console.log({next})
              localStorage.setItem("tempOtp",next.data.confirmOtp)
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/forgot-password/reset-password"]);
              
            } else {
              this.addToast({title:'Error', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
            }
          },
          error => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
          })
    }
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
}
