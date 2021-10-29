import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Validation, PasswordValidation } from '../../helper/validation';
import { DriverService, OperatorService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
})
export class OperatorComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  operatorForm: FormGroup;
  isSubmitted: boolean = false;
  countryFlagUrl: any;
  operator_id!:string;
  editMode = false;
  edit = true;
  countries: any;
  operatorData: any;


  constructor(
    config: NgbDatepickerConfig,
    private validation: Validation,
    private driverService: DriverService,
    private operatorService: OperatorService,
    private toastyService: ToastyService,
    private router: Router,
    private fb: FormBuilder,
    private route:ActivatedRoute,
    private ngbDateParserFormatter: NgbDateParserFormatter,
  ) {
    config.minDate = {year: 1900, month: 1, day: 1};
    config.maxDate = {year: (new Date()).getFullYear(), month: (new Date()).getMonth()+1, day: (new Date()).getDate()};
    this.operatorForm = fb.group({
      userType:new FormControl("promoter",[]),
      dob: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(this.validation.integer),
      ]),
      Commission:new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        Validators.pattern(this.validation.integer),
      ]),
      countryCode: new FormControl("", [Validators.required]),
      name: new FormControl("", [Validators.required, Validators.pattern(this.validation.alphabaticOnly), Validators.minLength(2), Validators.maxLength(50)]),
      // last_name: new FormControl("", [Validators.required, Validators.pattern(this.validation.alphabaticOnly), Validators.minLength(2), Validators.maxLength(50)]),
      email: new FormControl("", [Validators.required, Validators.pattern(this.validation.email)]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    }, {
      validator: PasswordValidation.MatchPassword // your custom validation method  
    });
   }
   getAllCountries() {
    this.loading = true;
    this.driverService.getAllCountries().subscribe(
      (respone) => {
        this.loading = false;
        let resData = JSON.parse(JSON.stringify(respone));
        this.countries = resData.data.countries;
        this.countryFlagUrl = resData.data.countryFlagUrl;
        this.operatorForm.patchValue({
          countryCode: this.countries[0].phoneCode,
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
  }
  getOperatorDetails() {
    this.loading = true;
    this.operatorService.getOperatorDetails(this.operator_id).subscribe(
      respone => {
        this.loading = false;
        this.operatorData = respone.data;
        console.log(respone.data);
//        console.log("this.operatorData",this.operatorData.countryCode)
        this.operatorForm.setValue({
          name: this.operatorData.name,
          phoneNumber: this.operatorData.phoneNumber,
          countryCode: this.operatorData.countryCode,
          Commission:this.operatorData.userCommission,
          dob: this.ngbDateParserFormatter.parse(this.operatorData.dob),
          email: this.operatorData.email,
        })
      },
      error => {
        this.loading = false;
        this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
      }
    );
  }
  onChangeMobileNumber() {
    let firstDigit = this.operatorForm.value.phoneNumber.slice(0, 1);
    if (firstDigit == 0) {
      this.operatorForm.value.phoneNumber = this.operatorForm.value.phoneNumber.slice(
        1,
        this.operatorForm.value.phoneNumber.length
      );
      this.operatorForm.patchValue({
        phoneNumber: this.operatorForm.value.phoneNumber,
      });
    }
  }
  ngOnInit() { 
    this.route.params.subscribe((params:Params) => {
        this.operator_id = params['operator_id'];
        this.editMode = params['operator_id']!=null;
    });
    this.getAllCountries();
    if(this.editMode){
        // document.getElementById('password1').remove();
        // document.getElementById('password2').remove();
        this.operatorForm.clearValidators();
        this.operatorForm.removeControl('password');
        this.operatorForm.removeControl('confirmPassword');
        this.operatorForm.removeControl('userType');
        console.log(this.operatorForm);
        this.getOperatorDetails();
    }
  }
  onEdit(){
      this.edit = false;
      document.getElementById('edit').remove();
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

  onFormSubmit() {
    this.isSubmitted = true;
    if (this.operatorForm.valid) {
      this.loading = true;
    if (
      this.operatorForm.value &&
      !this.operatorForm.value.onlyPhoneNumber
    ) {
      if (this.operatorForm.value.dob.month.toString().length <= 1) {
        this.operatorForm.value.dob.month =
          "0" + this.operatorForm.value.dob.month;
      }
      if (this.operatorForm.value.dob.day.toString().length <= 1) {
        this.operatorForm.value.dob.day =
          "0" + this.operatorForm.value.dob.day;
      }
      this.operatorForm.value.dob =
        this.operatorForm.value.dob.year +
        "-" +
        this.operatorForm.value.dob.month +
        "-" +
        this.operatorForm.value.dob.day;
      this.operatorForm.value.onlyPhoneNumber = this.operatorForm.value.phoneNumber;
    //   this.operatorForm.value.phoneNumber =
    //     this.operatorForm.value.countryCode +
    //     this.operatorForm.value.phoneNumber;
    }
    let params = this.operatorForm.value;
    if(this.editMode){
        let formData: FormData = new FormData();
        for (let key in params) {
            formData.append(key, params[key]);
        }
        formData.append('id',this.operator_id)
        this.operatorService.editOperator(formData)
            .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/operator/"]);
            } else {
              this.addToast({title:'Error', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
            }
          },
          error => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
          })
       return;
    }
    delete this.operatorForm.value.confirmPassword;
    console.log("params",params)
    
    this.operatorService.addOperator(params)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/operator/"]);
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
