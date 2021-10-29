import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Validation, PasswordValidation } from "../../helper/validation";
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";
import { Router } from "@angular/router";
import { FileValidator } from "../../helper/file-input.validator";
import { DriverService, OperatorService } from "../../services";
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { PromotionCodeService } from '../../services/promotion-code.service';
// import { environment } from './src/environments/environment';
@Component({
  selector: 'view-promotion-code',
  templateUrl: './view-promotion-code.component.html'
})
export class ViewPromotionCodeComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  viewPromoCodeForm: FormGroup;
  isSubmitted: boolean = false;
  usersData: any;
  usersGroupData: any;
  action: string = 'view';
  disabled: Boolean = true;

  

  constructor(
    config: NgbDatepickerConfig,
    private validation: Validation,
    private operatorService:OperatorService,
    private toastyService: ToastyService,
    private router: Router,
    private promotionService: PromotionCodeService,
    private fileValidator: FileValidator,
    private fb: FormBuilder,

  ) {
    config.minDate = {year: 1900, month: 1, day: 1};
    config.maxDate = {year: (new Date()).getFullYear(), month: (new Date()).getMonth(), day: (new Date()).getDate()};
   
    this.viewPromoCodeForm = fb.group({
      promoCode: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alpha_numeric),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      // email: new FormControl("", [
      //   Validators.pattern(this.validation.email)
      // ]),
      couponId: new FormControl(""),
      startDate: new FormControl("", [Validators.required]),
      isActive: new FormControl(true),
      expireDate: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
     // position: new FormControl("", [Validators.required]),
      discount: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(16),
        Validators.pattern(this.validation.integer)
      ]),

     // password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
     // confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    // },{
    //   validator: PasswordValidation.MatchPassword 

    });
   }
   getPromoCodeDetailsById(id){
    this.promotionService.getPromoCodeDetailsById(id)
    .subscribe(next => {
      console.log("next",next)
  
      this.viewPromoCodeForm.controls['couponId'].setValue(next.data._id);
      this.viewPromoCodeForm.controls['promoCode'].setValue(next.data.code);

        var current_date = new Date(next.data.startDate)
        var expire_date = new Date(next.data.expireDate)
      


      this.viewPromoCodeForm.controls['startDate'].setValue({year: current_date.getFullYear(), month: current_date.getMonth(), day: current_date.getDay()});

      this.viewPromoCodeForm.controls['isActive'].setValue(next.data.isActive);

      this.viewPromoCodeForm.controls['expireDate'].setValue({year: expire_date.getFullYear(), month: expire_date.getMonth(), day: expire_date.getDay()});
      this.viewPromoCodeForm.controls['type'].setValue(next.data.promotionCodeType);
      this.viewPromoCodeForm.controls['discount'].setValue(next.data.discount);


   });
   }
  ngOnInit() {
    // Menu Active process Start
  // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
  // {
  //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
  // }
  // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[5].getElementsByTagName("li")[0].className = "ng-star-inserted active"
  // menu Active Process End
    let url = window.location.href.split("/")
    let url_id = url[url.length-1];
    console.log("url_id",url_id)
    this.getPromoCodeDetailsById(url_id);
  }
  onEdit() {
    this.action = 'edit';
    this.disabled = false;
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
      onRemove: (toast: ToastData) => {}
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

  // onChangeMobileNumber() {
  //   let firstDigit = this.viewPromoCodeForm.value.phoneNumber.slice(0,1);
  //   if(firstDigit == 0) {
  //     this.viewPromoCodeForm.value.phoneNumber = this.viewPromoCodeForm.value.phoneNumber.slice(1,this.viewPromoCodeForm.value.phoneNumber.length);
  //     this.viewPromoCodeForm.patchValue({
  //      'phoneNumber': this.viewPromoCodeForm.value.phoneNumber
  //     })
  //   }
  // }

  onFormSubmit() {
    this.isSubmitted = true;
    let params = this.viewPromoCodeForm.value;
    let formData: FormData = new FormData();
    for (let key in params) {
        formData.append(key, params[key]);
    }
    

      // let params = this.viewPromoCodeForm.value;
      // let formData: FormData = new FormData();
      // for (let key in params) {
      //     formData.append(key, params[key]);
      // }

      console.log("1245",this.viewPromoCodeForm.valid)
      
      if (this.viewPromoCodeForm.valid) {
    this.loading = true;
        console.log("01245",this.viewPromoCodeForm.value)
      this.operatorService.editPromotionCode(this.viewPromoCodeForm.value)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/promotion-code/"]);
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

