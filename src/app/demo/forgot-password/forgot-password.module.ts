import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastyModule } from 'ng2-toasty';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgxLoadingModule } from 'ngx-loading';
import { NgOtpInputModule } from 'ng-otp-input';
import { CustomFormsModule } from 'ng2-validation';
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { OtpComponent } from './otp/otp.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ToastyModule,
    InputTrimModule,
    NgxLoadingModule.forRoot({}),
    CustomFormsModule,
    NgOtpInputModule,
    ForgotPasswordRoutingModule
  ],
  declarations: [ForgotPasswordComponent,OtpComponent,ResetPasswordComponent]
})
export class ForgotPasswordModule { }
