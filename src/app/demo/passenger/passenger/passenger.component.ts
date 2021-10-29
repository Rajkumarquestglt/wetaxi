import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../helper/validation';
import { PassengerService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileValidator } from '../../helper/file-input.validator';
import { NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from "src/environments/environment";
import { config } from 'rxjs';

@Component({
  selector: 'passenger',
  templateUrl: './passenger.component.html',
})
export class PassengerComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
public secondaryColour = "#ffffff";
  position = 'bottom-right';
  passengerForm: FormGroup;
  isSubmitted: boolean = false;
  extension: any;
  isImageExtensionError: Boolean = false;
  isImageSelected: Boolean = false;
  profilePhoto: any = {};
  countries: any;
  countryFlagUrl: any;
  imageSrc: string | ArrayBuffer;
  profilePhotoUrl: string;
  defaultPic: string;
  isProfileType: Boolean = false;
  isflag: boolean = false;
  editMode = false;
  passenger_id!:string;
  passengerData: any;
  errorMessageName: string = "Please enter name";
    errorMessageEmail: string;
    isValidMobileNo: boolean;
    errorMessagePhonenumber: string = "Please enter Mobile Number";
  constructor(
    config: NgbDatepickerConfig,
    private validation: Validation,
    private passengerService: PassengerService,
    private toastyService: ToastyService,
    private router: Router,
    private route:ActivatedRoute,
    private fileValidator: FileValidator,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) { 
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth()+1, day: (new Date()).getDate() };
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
        this.passenger_id = params['passenger_id'];
        this.editMode = params['passenger_id']!=null;
    });
    this.profilePhotoUrl = environment.profileImageUrl;

    this.defaultPic = this.profilePhotoUrl + 'default.png';
    this.passengerForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.pattern(this.validation.alphabaticOnly), Validators.minLength(2), Validators.maxLength(50)]),
      email: new FormControl("", [Validators.pattern(this.validation.email)]),
      dob: new FormControl("", [Validators.required]),
      countryCode: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.validation.integer)]),
      profilePhoto: new FormControl("", []),
      gender: new FormControl("male"),

      currentLocation: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(50)
      ])
    })
    this.getAllCountries();
    if(this.editMode)
      this.getPassengerDetails();
  }
  getAllCountries() {
    this.loading = true;
    this.passengerService.getAllCountries().subscribe(
      respone => {
        // console.log(respone);
        this.loading = false;
        let resData = JSON.parse(JSON.stringify(respone));
        this.countries = resData.data.countries;
        this.countryFlagUrl = resData.data.countryFlagUrl;
        this.passengerForm.patchValue({
          countryCode: this.countries[0].phoneCode
        })
      },
      error => {
        this.loading = false;
        this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
      }
    );
  }
  getPassengerDetails() {
    this.loading = true;
    let passengerData = {
      'passenger_id': this.passenger_id
    }
    this.passengerService.getPassengerDetails(passengerData).subscribe(
      respone => {
        this.loading = false;
        this.passengerData = respone.data;
        this.imageSrc = this.passengerData.profilePhoto?environment.profileImageUrl+this.passengerData.profilePhoto:"../../../../assets/images/profile-dummy.png";
        // console.log(this.passengerData);
        this.passengerForm.setValue({
          name: this.passengerData.name,
          currentLocation:this.passengerData.currentLocation,
          email: this.passengerData.email,
          gender: this.passengerData.gender,

          dob: this.ngbDateParserFormatter.parse(this.passengerData.dob),
          countryCode: this.passengerData.countryCode,
          phoneNumber: this.passengerData.onlyPhoneNumber,
          profilePhoto: null
        });
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

  onChangeMobileNumber(e) {
    let firstDigit = this.passengerForm.value.phoneNumber.slice(0,1);
    if(firstDigit == 0) {
      this.passengerForm.value.phoneNumber = this.passengerForm.value.phoneNumber.slice(1,this.passengerForm.value.phoneNumber.length);
      this.passengerForm.patchValue({
       'phoneNumber': this.passengerForm.value.phoneNumber
      })
    } else {
        this.errorMessagePhonenumber = "";
        if(e.target.classList.contains('ng-touched') && e.target.value === ""){
            this.errorMessagePhonenumber = "Please enter mobile number";
        } else if(this.passengerForm.hasError("pattern", "phoneNumber")){
            this.errorMessagePhonenumber = "Please enter valid mobile number";
        } else if(e.target.value.length<8 || 16<e.target.value.length){
            this.errorMessagePhonenumber = "Mobile number must contain 8 to 16 digits";
        }
    }
  }
  onImageChange(e) {
    const vm = this;
    // console.log("size",e.target.files[0].size)
    if (
      e.target.files.length > 0 &&
      e.target.files[0] &&
      e.target.files[0].size <= 2048000
    ) {
      let file = e.target.files[0];

      if (
        file &&
        (e.target.files[0].type == "image/jpeg" ||
          e.target.files[0].type == "image/png" ||
          e.target.files[0].type == "image/jpg")
      ) {
        this.isImageSelected = true;
        this.isProfileType = true;
        // console.log("this.isProfileType ",this.isProfileType )

        if (!this.fileValidator.validateImage(file.name)) {
          this.isImageExtensionError = true;
        } else {
          this.isImageExtensionError = false;
          const reader = new FileReader();
          reader.onload = (e) => (this.imageSrc = reader.result);
          // console.log("reader",reader)
          reader.readAsDataURL(file);
        }
        this.profilePhoto = file;
        // console.log(this.profilePhoto);
      }
    }

    else {
      this.isflag = true;
      this.isProfileType = false;
      this.profilePhoto = "";
      this.isImageSelected = false;
      this.isImageExtensionError = false;

      if (!e.target.files[0]) {
        this.imageSrc = null;
      }
    }
  }
  
  onFormSubmit() {
    this.isSubmitted = true;
    if (this.passengerForm.valid && !this.isImageExtensionError && this.passengerForm.value.profilePhoto!="") {
      this.loading = true;

      if(this.passengerForm.value && !this.passengerForm.value.onlyPhoneNumber) {
        if(this.passengerForm.value.dob.month.toString().length <= 1) {
          this.passengerForm.value.dob.month = '0' + this.passengerForm.value.dob.month;
        }
        if(this.passengerForm.value.dob.day.toString().length <= 1) {
          this.passengerForm.value.dob.day = '0' + this.passengerForm.value.dob.day;
        }
        this.passengerForm.value.dob = this.passengerForm.value.dob.year + '-' + this.passengerForm.value.dob.month + '-' + this.passengerForm.value.dob.day;
        this.passengerForm.value.onlyPhoneNumber = this.passengerForm.value.phoneNumber;
        this.passengerForm.value.phoneNumber = this.passengerForm.value.countryCode +  this.passengerForm.value.phoneNumber;
      }
      this.passengerForm.value.passenger_id = this.passenger_id;
      let params = this.passengerForm.value;
      let formData: FormData = new FormData();
      for (let key in params) {
          formData.append(key, params[key]);
      }
      if(this.isImageSelected) {
        formData.append("profilePhoto", this.profilePhoto);
      }
      if(this.editMode){
          // console.log(formData.get('gender'));
        this.passengerService.editPassenger(formData)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/passenger/"]);
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
      this.passengerService.addPassenger(formData)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/passenger/"]);
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
  handleValidationName(e) {
    this.errorMessageName = "";
    if(e.target.classList.contains('ng-touched') && e.target.value === ""){
      this.errorMessageName = "Please enter name.";
    } else if(this.passengerForm.hasError("pattern", "name")){
        this.errorMessageName = "Name should contains alphabetic only";
    } else if(e.target.value.length<2 || 50<e.target.value.length){
      this.errorMessageName = "Name must be 2 to 50 characters long.";
    }
  }
  handleValidationEmail(e) {
    this.errorMessageEmail = "";
    if(this.passengerForm.hasError("pattern", "email")){
      this.errorMessageEmail = "please enter valid email.";
    }
  }
}
