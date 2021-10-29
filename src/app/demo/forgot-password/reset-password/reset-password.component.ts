import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {  PasswordValidation } from '../../helper/validation';
import { AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',

})
export class ResetPasswordComponent implements OnInit{
    public loading = false;
    public primaryColour = "#ffffff";
    public secondaryColour = "#ffffff";
    position = 'bottom-right';
    resetForm: FormGroup;
    isSubmitted: boolean = false;
     
    constructor(
        private authService: AuthService,
      private toastyService: ToastyService,
      private router: Router,
      private fb: FormBuilder,
    ) {
      
      this.resetForm = fb.group({
       
        password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
        confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      }, {
        validator: PasswordValidation.MatchPassword // your custom validation method  
      });
     }

    ngOnInit() { 
     let tempOtp=localStorage.getItem("tempOtp");
     if(!tempOtp){
      this.router.navigate(["/forgot-password"]);
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
  
    onresetFormSubmit() {
      this.isSubmitted = true;
      if (this.resetForm.valid) {
        this.loading = true;
           
      let params = {
        "password":this.resetForm.value.password,
        "confirmOtp":localStorage.getItem("tempOtp")
      }
        delete this.resetForm.value.confirmPassword;
          this.authService.reserPassword(params)
          .subscribe(next => {
              this.loading = false;
              this.isSubmitted = false;
              if (next.status_code == 200) {
                localStorage.clear();
                this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/login/"]);
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
  
  }
  
