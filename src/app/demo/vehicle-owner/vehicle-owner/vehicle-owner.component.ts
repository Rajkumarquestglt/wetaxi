import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidation, Validation } from '../../helper/validation';
import { DriverService, OperatorService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'vehicle-owner',
  templateUrl: './vehicle-owner.component.html',
})
export class VehicleOwnerComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  action: string = 'view';
  position = 'bottom-right';
  vehicleOwnerForm: FormGroup;
  isSubmitted: boolean = false;
  operatorData: any = {};
  editMode = false;
  vehicle_owner_id: any;
  countries: any;
  countryFlagUrl: any;
  countryCode: number;
  userType: any;
  edit = true;

  constructor(
    config: NgbDatepickerConfig,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private driverService: DriverService,
    private validation:Validation,
    private operatorService: OperatorService,
    private toastyService: ToastyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.userData();
    config.minDate = {year: 1900, month: 1, day: 1};
    config.maxDate = {year: (new Date()).getFullYear(), month: (new Date()).getMonth()+1, day: (new Date()).getDate()};
    this.vehicleOwnerForm = fb.group({
      userType:new FormControl(this.userType,[]),
      name: new FormControl("", [Validators.required, Validators.pattern(this.validation.alphabaticOnly), Validators.minLength(2), Validators.maxLength(50)]),
      dob: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(this.validation.integer),
      ]),
      Commission: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        Validators.pattern(this.validation.integer),
      ]),
      countryCode: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.pattern(this.validation.email)]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    }, {
      validator: PasswordValidation.MatchPassword // your custom validation method  
    });
  }
  userData() {
    let adminData = JSON.parse(localStorage.getItem("adminData"));
    this.userType = adminData.type;
    console.log("adminData", this.userType);
  }
  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.vehicle_owner_id = params['vehicle_owner_id'];
      this.editMode = params['vehicle_owner_id']!=null;
    });
    this.getAllCountries();
    if(this.editMode){
      // document.getElementById('password1').remove();
      // document.getElementById('password2').remove();
      this.vehicleOwnerForm.clearValidators();
      this.vehicleOwnerForm.removeControl('password');
      this.vehicleOwnerForm.removeControl('confirmPassword');
      this.vehicleOwnerForm.removeControl('userType');
      this.getOperatorDetails();
    }
}
getAllCountries() {
  this.loading = true;
  this.driverService.getAllCountries().subscribe(
    (respone) => {
      this.loading = false;
      let resData = JSON.parse(JSON.stringify(respone));
      this.countries = resData.data.countries;
      this.countryFlagUrl = resData.data.countryFlagUrl;
      this.vehicleOwnerForm.patchValue({
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
onChangeMobileNumber() {
  let firstDigit = this.vehicleOwnerForm.value.phoneNumber.slice(0, 1);
  if (firstDigit == 0) {
    this.vehicleOwnerForm.value.phoneNumber = this.vehicleOwnerForm.value.phoneNumber.slice(
      1,
      this.vehicleOwnerForm.value.phoneNumber.length
    );
    this.vehicleOwnerForm.patchValue({
      phoneNumber: this.vehicleOwnerForm.value.phoneNumber,
    });
  }
}
  onEdit() {
    this.edit = false;
  }

  getOperatorDetails() {
    this.loading = true;
    this.operatorService.getOperatorDetails(this.vehicle_owner_id).subscribe(
      respone => {
        this.loading = false;
        this.operatorData = respone.data;
        this.vehicleOwnerForm.setValue({
         name: this.operatorData.name,
         phoneNumber: this.operatorData.phoneNumber,
         countryCode: this.operatorData.countryCode,
         Commission:this.operatorData.userCommission,
         dob: this.ngbDateParserFormatter.parse(this.operatorData.dob),
          // last_name: this.operatorData.last_name,
          email: this.operatorData.email,
          // password: this.operatorData.password
        })
      },
      error => {
        this.loading = false;
        this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
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

  onDelete() {
    this.loading = true;
    let operatorData = {
      'operator_id': this.vehicle_owner_id
    }
    this.operatorService.deleteOperator(operatorData).subscribe(
      next => {
        this.loading = false;
        if(next.status_code == 200) {
        } this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
        this.router.navigate(["/vehicle-owner/"]);
      },
      error => {
        this.loading = false;
        this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
      }
    );
  }

  onFormSubmit() {
    this.isSubmitted = true;
    if (this.vehicleOwnerForm.valid) {
      this.loading = true;
      
        if (this.vehicleOwnerForm.value.dob.month.toString().length <= 1) {
          this.vehicleOwnerForm.value.dob.month =
            "0" + this.vehicleOwnerForm.value.dob.month;
        }
        if (this.vehicleOwnerForm.value.dob.day.toString().length <= 1) {
          this.vehicleOwnerForm.value.dob.day =
            "0" + this.vehicleOwnerForm.value.dob.day;
        }
        this.vehicleOwnerForm.value.dob =
          this.vehicleOwnerForm.value.dob.year +
          "-" +
          this.vehicleOwnerForm.value.dob.month +
          "-" +
          this.vehicleOwnerForm.value.dob.day;
        this.vehicleOwnerForm.value.onlyPhoneNumber = this.vehicleOwnerForm.value.phoneNumber;
          let params = this.vehicleOwnerForm.value;
          let formData: FormData = new FormData();
          for (let key in params) {
            formData.append(key, params[key]);
          }
          if(!this.editMode){
            delete this.vehicleOwnerForm.value.confirmPassword;
            params.userType = "vehicleOwner"
            if(this.userType == 'promoter'){
              this.operatorService.addOperatorPromoter(params)
              .subscribe(next => {
                    this.loading = false;
                    this.isSubmitted = false;
                    if (next.status_code == 200) {
                      this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                      this.router.navigate(["/vehicle-owner/"]);
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
              this.operatorService.addOperator(params)
              .subscribe(next => {
                console.log(next);
                    this.loading = false;
                    this.isSubmitted = false;
                    if (next.status_code == 200) {
                      this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                      this.router.navigate(["/vehicle-owner/"]);
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
            return;
          }
          this.vehicleOwnerForm.value.vehicle_owner_id = this.vehicle_owner_id;
          formData.append('id',this.vehicle_owner_id);
          formData.set('userType','vehicleOwner');
          if(this.userType == 'promoter'){
            this.operatorService.editVehicleOwnerPromoter(formData)
            .subscribe(next => {
              this.loading = false;
          this.isSubmitted = false;
          if (next.status_code == 200) {
            this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
            this.router.navigate(["/vehicle-owner/"]);
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
      this.operatorService.editVehicleOwner(formData)
      .subscribe(next => {
          this.loading = false;
          this.isSubmitted = false;
          if (next.status_code == 200) {
            this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
            this.router.navigate(["/vehicle-owner/"]);
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

}

