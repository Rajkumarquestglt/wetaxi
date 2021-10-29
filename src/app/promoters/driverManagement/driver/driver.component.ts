import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators,FormsModule } from "@angular/forms";
import { Validation } from "src/app/demo/helper/validation";
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FileValidator } from "src/app/demo/helper/file-input.validator";
import { DriverService } from "src/app/demo/services";
import { NgbDateParserFormatter, NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";

@Component({
  selector: "driver",
  templateUrl: "./driver.component.html",
})
export class DriverComponent implements OnInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  minlen = 2;
  maxlen = 50;
  driver_id!:string;
  editMode = false;
  imageUrl = "../../../../assets/images/profile-dummy.png";
  driverForm: FormGroup;
  isSubmitted: boolean = false;
  isValidName: boolean = false;
  isValidEmail: boolean = false;
  isValidMobileNo: boolean = false;
  imageProfileValid = true;
  imageId1Valid = true;
  imageId2Valid = true;

  isProfileExtensionError: Boolean = false;
  isProfileSelected: Boolean = false;
  isProfileType: Boolean = false;
  isImageSize: Boolean = false;
  isImageSize1: Boolean = false;

  profilePhoto: any = {};
  idPhotos1: any = [];
  isflag: boolean = false;
  isflag1: boolean = false;
  isflag2: boolean = false;
  flag4 = false;
  flag5 = false;
  removeIdPhotos: any = [];
  removeIdPhotos1: any = [];

  x: any = [];

  countries: any;
  vehicleTypes: any;
  test: any = [];

  // imageSrc: string;
  vehicleColors: any;
  countryFlagUrl: any;
  vehicleTypeImageUrl: any = environment.vehicleTypeImageUrl;

  /** vehicle photos variables */
  vehiclePhotoImageArray: any = [];
  vehiclePhotoLengthError: Boolean = false;
  isVehiclePhotosExtensionError: Boolean = false;
  isVehiclePhotosSelected: Boolean = false;

  /** id photos variables */
  idPhotoImageArray: any = [];
  idPhotoImageLengthError: Boolean = false;
  isIdPhotosExtensionError: Boolean = false;
  isIdPhotosSelected: Boolean = false;

  idPhotoImageArray1: any = [];
  idPhotoImageLengthError1: Boolean = false;
  isIdPhotosExtensionError1: Boolean = false;
  isIdPhotosSelected1: Boolean = false;

  /** vehicle id photos variables */
  vehicleIdPhotoImageArray: any = [];
  vehicleIdPhotoImageLengthError: Boolean = false;
  isVehicleIdPhotosExtensionError: Boolean = false;
  isVehicleIdPhotosSelected: Boolean = false;

  vehicleIdPhotoImageArray1: any = [];
  vehicleIdPhotoImageLengthError1: Boolean = false;
  isVehicleIdPhotosExtensionError1: Boolean = false;
  isVehicleIdPhotosSelected1: Boolean = false;
  /** plate number photos variables */
  plateNoPhotoImageArray: any = [];
  plateNoPhotoImageLengthError: Boolean = false;
  isPlateNoPhotosExtensionError: Boolean = false;
  isPlateNoPhotosSelected: Boolean = false;
  imageSrc: string | ArrayBuffer;
  test1: any = [];
  idPhotos: any;
  vehicleIdPhotos: any;
  imageSrc1: string | ArrayBuffer;
  imageSrc2: string | ArrayBuffer;
  imageSrc3: string | ArrayBuffer;
  imageSrc4: string | ArrayBuffer;
  profilePhotoUrl: string;
  defaultPic: string;
  isIdImage1: boolean;
  errorMessageName = "";
  errorMessageEmail = "";
  errorMessagePhonenumber = "";
  errorMessageLicencenumber = "";
  idImageFront: any;
  driverData: any;
  idImageBack: any;
  oldIdPhotos: any;
  viewDriverBillingPlanForm: FormGroup;

  constructor(
    config: NgbDatepickerConfig,
    private validation: Validation,
    private driverService: DriverService,
    private toastyService: ToastyService,
    private router: Router,
    private route:ActivatedRoute,
    private fileValidator: FileValidator,
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear()-18,
      month: new Date().getMonth(),
      day: new Date().getDate(),
    };
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.driver_id = params['driver_id'];
      this.editMode = params['driver_id']!=null;
    });
    this.profilePhotoUrl = environment.profileImageUrl;
    this.defaultPic = this.profilePhotoUrl + "default.png";
    this.driverForm = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      drivingNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alpha_numeric),
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: new FormControl("", [Validators.pattern(this.validation.email)]),
      dob: new FormControl("", [Validators.required]),
      countryCode: new FormControl("", [Validators.required]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(this.validation.integer),
      ]),
      profilePhoto: new FormControl("", []),
      gender: new FormControl("male"),
      idPhotos1: new FormControl("", []),
      idPhotos2: new FormControl("", []),
    });
    this.getAllCountries();
    this.getAllVehicleTypes();
    if(this.editMode){
      this.viewDriverBillingPlanForm = new FormGroup({
        billingId: new FormControl("", [Validators.required]),
      });
      this.getDriverDetails();
    }
  }
  getDriverDetails() {
    this.loading = true;
    let driverData = {
      driver_id: this.driver_id,
    };
    this.driverService.getDriverDetails(driverData).subscribe(
      (respone) => {
        this.loading = false;
        this.driverData = respone.data;
        this.imageSrc = environment.profileImageUrl+this.driverData.profilePhoto;
        this.imageSrc1 = environment.profileImageUrl+respone.data.idPhotos[0];
        this.imageSrc2 = environment.profileImageUrl+respone.data.idPhotos[1];
        this.oldIdPhotos = this.driverData.idPhotos;
        this.driverForm.patchValue({
          name: this.driverData.name,
          drivingNumber: this.driverData.drivingLicence,
          gender: this.driverData.gender,
          email: this.driverData.email,
          dob: this.ngbDateParserFormatter.parse(this.driverData.dob),
          countryCode: this.driverData.countryCode,
          phoneNumber: this.driverData.onlyPhoneNumber,
        });
        this.viewDriverBillingPlanForm.setValue({
          billingId:
            this.driverData && this.driverData.billingId
              ? this.driverData.billingId
              : "",
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
  countryChange(event){
    let selectedOptions = event.target['options'];
    switch(selectedOptions[selectedOptions.selectedIndex].text){
      case "+1 - US":
        this.minlen = 6;
        this.maxlen = 12;
        break;
      case "+34 - sp":
        this.minlen = 10;
        this.maxlen = 18;
        break;
      case "+91 - IN":
        this.minlen = 16;
        this.maxlen = 16;
        break;
    }
    this.driverForm.controls['drivingNumber'].setValidators([Validators.required,Validators.pattern(this.validation.alpha_numeric),,Validators.minLength(this.minlen),Validators.maxLength(this.maxlen)]);
  }
  genderChange(event){
    let selectedOptions = event.target['options'];
    if(!this.imageSrc){
      switch(selectedOptions[selectedOptions.selectedIndex].text){
        case "Male":
          this.imageUrl = "../../../../assets/images/profile-dummy.png";
          break;
        case "Female":
          this.imageUrl = "../../../../assets/images/profile-dummy-girl.png";
          break;
      }
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
        this.driverForm.patchValue({
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

  getAllVehicleTypes() {
    this.loading = true;
    this.driverService.getAllVehicleTypes().subscribe(
      (respone) => {
        this.loading = false;
        let resData = JSON.parse(JSON.stringify(respone));
        let vehicleTypesArray = resData.data.vehicleType;
        let vehicleColorsArray = resData.data.colors;
        this.vehicleTypes = vehicleTypesArray.map(function (vehicleType) {
          return {
            label: vehicleType.type.en,
            value: vehicleType._id,
            image: vehicleType.image,
          };
        });

        this.vehicleColors = vehicleColorsArray.map(function (vehicleColor) {
          return { label: vehicleColor.name.en, value: vehicleColor.code };
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
      onRemove: (toast: ToastData) => {},
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
  readURL(event: Event): void {}
  onImageChange(e) {
    const vm = this;
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
        this.isProfileSelected = true;
        this.isProfileType = true;

        if (!this.fileValidator.validateImage(file.name)) {
          this.isProfileExtensionError = true;
        } else {
          this.isProfileExtensionError = false;
          const reader = new FileReader();
          reader.onload = (e) => (this.imageSrc = reader.result);
          reader.readAsDataURL(file);
        }
        this.profilePhoto = file;
        this.imageProfileValid = true;
      }
      else{
        this.imageProfileValid = false;
      }
    }

    else {
      this.isflag = true;
      this.profilePhoto = "";
      this.isProfileType = false;
      this.isProfileSelected = false;
      this.isProfileExtensionError = false;

      if (!e.target.files[0]) {
        this.imageSrc = null;
      }
    }
  }
  onIdImageChange1(e) {
    this.idPhotoImageArray1 = [];
    const vm = this;
    if (
      !(e.target.files[0].type == "image/jpeg" ||
        e.target.files[0].type == "image/png" ||
        e.target.files[0].type == "image/jpg")
    ){
      this.imageId2Valid = false;
      return;
    }
    this.imageId2Valid = true;

    if (
      e.target.files.length > 0 &&
      e.target.files[0] &&
      e.target.files[0].size <= 2048000
    ) {
      this.isIdPhotosSelected1 = true;
      this.isImageSize1 = true;
      let file = e.target.files[0];
      if (
        file &&
        (e.target.files[0].type == "image/jpeg" ||
          e.target.files[0].type == "image/png" ||
          e.target.files[0].type == "image/jpg")
      ) {
      this.isImageSize1 = true;
      let filesLength = e.target.files.length;
      let files = e.target.files;
      for (let i = 0; i < filesLength; i++) {
        if (!this.fileValidator.validateImage(files[i].name)) {
          this.isIdPhotosExtensionError1 = true;
        } else {
          this.isIdPhotosExtensionError1 = false;
          let reader = new FileReader();
          reader.onload = (e) => (this.imageSrc2 = reader.result);
          reader.readAsDataURL(file);
          this.idPhotoImageArray1.push(files[i]);
        }
      }
      if (
        this.idPhotoImageArray1.length < 1 ||
        this.idPhotoImageArray1.length > 2
      ) {
        this.idPhotoImageLengthError1 = true;
      } else {
        this.idPhotoImageLengthError1 = false;
      }
    }}
     else {
      this.isflag2 = true;
      if (!e.target.files[0]) {
        this.imageSrc2 = null;
      }
      this.isImageSize1 = false;
      this.isIdImage1=false;
      this.idPhotoImageArray1 = [];
      this.idPhotoImageLengthError1 = true;
      this.isIdPhotosSelected1 = false;
      this.isIdPhotosExtensionError1 = false;
    }
  }
  onIdImageChange(e) {
    if (
      !(e.target.files[0].type == "image/jpeg" ||
        e.target.files[0].type == "image/png" ||
        e.target.files[0].type == "image/jpg")
    ){
      this.imageId1Valid = false;
      return;
    }
    this.imageId1Valid = true;
    this.idPhotoImageArray = [];
    const vm = this;
    if (
      e.target.files.length > 0 &&
      e.target.files[0] &&
      e.target.files[0].size <= 2048000
    ) {
      this.isIdPhotosSelected = true;
      this.isImageSize = true;
      let filesLength = e.target.files.length;
      let file = e.target.files[0];
      let files = e.target.files;
      for (let i = 0; i < filesLength; i++) {
        if (!this.fileValidator.validateImage(files[i].name)) {
          this.isIdPhotosExtensionError = true;
        } else {
          this.isIdPhotosExtensionError = false;
          let reader = new FileReader();
          reader.onload = (e) => (this.imageSrc1 = reader.result);
          reader.readAsDataURL(file);
          this.idPhotoImageArray.push(files[i]);
        }
      }
      if (
        this.idPhotoImageArray.length < 1 ||
        this.idPhotoImageArray.length > 2
      ) {
        this.idPhotoImageLengthError = true;
      } else {
        this.idPhotoImageLengthError = false;
      }
    } else {
      this.isflag1 = true;
      this.isImageSize = false;

      this.idPhotoImageArray = [];
      this.idPhotoImageLengthError = true;
      this.isIdPhotosSelected = false;
      this.isIdPhotosExtensionError = false;
      if (!e.target.files[0]) {
        this.imageSrc1 = null;
      }
    }
  }

  onChangeMobileNumber(e) {
    let firstDigit = this.driverForm.value.phoneNumber.slice(0, 1);
    if (firstDigit == 0) {
      this.driverForm.value.phoneNumber = this.driverForm.value.phoneNumber.slice(
        1,
        this.driverForm.value.phoneNumber.length
      );
      this.driverForm.patchValue({
        phoneNumber: this.driverForm.value.phoneNumber,
      });
    } else {
      this.errorMessagePhonenumber = "";
    if(e.target.classList.contains('ng-touched') && e.target.value === ""){
      this.errorMessagePhonenumber = "Please enter mobile number";
    } else if(e.target.value.length<8 || 16<e.target.value.length){
      this.errorMessagePhonenumber = "Mobile number must contain 8 to 16 digits";
    } else if(this.driverForm.hasError("pattern", "phoneNumber")){
      this.errorMessagePhonenumber = "Please enter valid mobile number";
    }
    }
  }
  onChangeUplinecode() {
    let firstDigit = this.driverForm.value.uplineCode.slice(0, 1);
    if (firstDigit == 0) {
      this.driverForm.value.uplineCode = this.driverForm.value.uplineCode.slice(
        1,
        this.driverForm.value.uplineCode.length
      );
      this.driverForm.patchValue({
        uplineCode: this.driverForm.value.uplineCode,
      });
    }
  }
  handleValidationName(e) {
    this.errorMessageName = "";
    if(e.target.classList.contains('ng-touched') && e.target.value === ""){
      this.errorMessageName = "Please enter name.";
    } else if(e.target.value.length<2 || 50<e.target.value.length){
      this.errorMessageName = "Name must be 2 to 50 characters long.";
    } else if(this.driverForm.hasError("pattern", "name")){
      this.errorMessageName = "Name should contains alphabetic only";
    }
  }
  handleValidationEmail(e) {
    this.errorMessageEmail = "";
    if(e.target.classList.contains('ng-touched') && e.target.value === ""){
      this.errorMessageEmail = "Please enter email.";
    } else if(this.driverForm.hasError("pattern", "email")){
      this.errorMessageEmail = "please enter valid email.";
    }
  }
  handleValidationMobile() {
    this.isValidMobileNo = true;
    if (
      !this.driverForm.hasError("required", "phoneNumber") &&
      !this.driverForm.hasError("pattern", "phoneNumber")&&!(this.driverForm.hasError('minlength', 'phoneNumber') ||
      this.driverForm.hasError('maxlength', 'phoneNumber'))
    ) {
      this.isValidMobileNo = false;
    }
  }
  handleValidationLicencenumber(e) {
    this.errorMessageLicencenumber = "";
    if(e.target.classList.contains('ng-touched') && e.target.value === ""){
      this.errorMessageLicencenumber = "Please Enter Driving Licence Number.";
    } else if(e.target.value.length<this.minlen || this.maxlen<e.target.value.length){
      this.errorMessageLicencenumber = "Driving Licence Number must be"+ this.minlen + " to " + this.maxlen +" characters long";
    } else if(this.driverForm.hasError("pattern", "drivingNumber")){
      this.errorMessageLicencenumber = "Driving Licence Number should contains alphnumeric only";
    }
  }
  removeIdImage(imageName: any) {
    if(!this.flag4 && this.editMode){
      this.flag4 = true;
      this.removeIdPhotos.push(imageName.split("/")[6]);
    }
  }
  removeIdImage1(imageName: any) {
    if(!this.flag5 && this.editMode){
      this.flag5 = true;
      this.removeIdPhotos1.push(imageName.split("/")[6]);
    }
  }
  onFormSubmit() {
    this.isSubmitted = true;
    if ( this.driverForm.valid &&
      ((this.isProfileSelected &&
      !this.isProfileExtensionError &&
      this.isIdPhotosSelected &&
      !this.isIdPhotosExtensionError &&
      !this.idPhotoImageLengthError) || this.editMode)
    ) {
      this.loading = true;

      if (
        this.driverForm.value &&
        !this.driverForm.value.onlyPhoneNumber
      ) {
        if (this.driverForm.value.dob.month.toString().length <= 1) {
          this.driverForm.value.dob.month =
            "0" + this.driverForm.value.dob.month;
        }
        if (this.driverForm.value.dob.day.toString().length <= 1) {
          this.driverForm.value.dob.day =
            "0" + this.driverForm.value.dob.day;
        }
        this.driverForm.value.dob =
          this.driverForm.value.dob.year +
          "-" +
          this.driverForm.value.dob.month +
          "-" +
          this.driverForm.value.dob.day;
        this.driverForm.value.onlyPhoneNumber = this.driverForm.value.phoneNumber;
        this.driverForm.value.phoneNumber =
          this.driverForm.value.countryCode +
          this.driverForm.value.phoneNumber;
      }
      this.driverForm.value.driver_id = this.driver_id;

      let params = this.driverForm.value;
      let formData: FormData = new FormData();
      formData.append("vehicleIdPhotos", this.vehicleIdPhotos);

      for (let key in params) {
        formData.append(key, params[key]);
      }
      let x = [params["idPhotos1"], params["idPhotos2"]];
      if (this.isProfileSelected) {
        formData.append("profilePhoto", this.profilePhoto);
      }
      if (this.isIdPhotosSelected && !this.flag4 && !this.flag5) {
          formData.append(
            "idPhotos",
            this.idPhotoImageArray[0],
            this.idPhotoImageArray[0].name
          );
          formData.append(
            "idPhotos",
            this.idPhotoImageArray1[0],
            this.idPhotoImageArray1[0].name
          );
      }
      if(this.editMode){
        if(this.flag4 && this.flag5)
          {
            console.log("Id both change")
            formData.append("removeIdPhotos", JSON.stringify(this.removeIdPhotos1.concat(this.removeIdPhotos)));
          }else if (this.flag4) {
            console.log("Id front change")
            formData.append("removeIdPhotos", JSON.stringify(this.removeIdPhotos));
          }else  if (this.flag5) {
            console.log("Id back change")
            formData.append("removeIdPhotos", JSON.stringify(this.removeIdPhotos1));
          }
          if(this.flag4){
            formData.append(
              "idPhotos",
              this.idPhotoImageArray[0],
              this.idPhotoImageArray[0].name
            );
          }
          if(this.flag5){
            formData.append(
              "idPhotos",
              this.idPhotoImageArray1[0],
              this.idPhotoImageArray1[0].name
            );
          }
        this.driverService.editDriverPromoter(formData).subscribe(
          (next) => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({
                title: "Success",
                msg: next.message,
                timeout: 5000,
                theme: "default",
                position: "bottom-right",
                type: "success",
              });
              this.router.navigate(["/driver-management-promoter"]);
            } else {
              this.addToast({
                title: "Error",
                msg: next.message,
                timeout: 5000,
                theme: "default",
                position: "bottom-right",
                type: "error",
              });
            }
          },
          (error) => {
            this.loading = false;
            this.isSubmitted = false;
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
        return;
      }
      this.driverService.addDriverPromter(formData).subscribe(
        (next) => {
          console.log("formData11", formData);

          this.loading = false;
          this.isSubmitted = false;
          if (next.status_code == 200) {
            this.addToast({
              title: "Success",
              msg: next.message,
              timeout: 5000,
              theme: "default",
              position: "bottom-right",
              type: "success",
            });
            this.router.navigate(["/driver-management-promoter"]);
          } else {
            this.addToast({
              title: "Error",
              msg: next.message,
              timeout: 5000,
              theme: "default",
              position: "bottom-right",
              type: "error",
            });
          }
        },
        (error) => {
          this.loading = false;
          this.isSubmitted = false;
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
  }
}
