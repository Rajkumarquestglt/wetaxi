import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../helper/validation';
import { Router } from '@angular/router';
import { AuthService } from '../services';
import {ToastData, ToastOptions, ToastyService} from 'ng2-toasty';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  
  position = 'bottom-right';
  resetPasswordForm: FormGroup;
  isSubmitted: boolean = false;
  @ViewChild('email') email: ElementRef;

  constructor(
    private router: Router,
    private validation: Validation,
    private authService: AuthService,
    private toastyService: ToastyService
  ) { }

  ngOnInit() {
    this.email.nativeElement.focus();
    this.resetPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern(this.validation.email)]),
      })
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

  onresetPasswordFormSubmit() {
    this.isSubmitted = true;
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      localStorage.setItem("tempEmail",this.resetPasswordForm.value.email)
      this.authService.forgotPassword(this.resetPasswordForm.value)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              console.log({next})
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/forgot-password/otp"]);
              
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
