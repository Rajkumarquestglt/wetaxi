import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NgbDatepickerConfig } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { Validation } from 'src/app/demo/helper/validation';
import { DriverService } from 'src/app/demo/services';
import { FileValidator } from 'src/app/demo/helper/file-input.validator';
 
@Component({
  selector: "vehicle",
  templateUrl: "./vehicle.component.html",
})
export class VehicleComponent implements OnInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  vehicleForm: FormGroup;
  isSubmitted: boolean = false;
  isProfileExtensionError: Boolean = false;
  isProfileSelected: Boolean = false;
  profilePhoto: any = {};
  idPhotos1: any = [];

  x: any = [];

  countries: any;
  vehicleTypes: any;
  test: any = [];
  vehicle_id:string;
  editMode = false;

  // imageSrc: string;
  vehicleColors: any;
  vehicleSeats = [
    {label: "3 Seats", value: "3"},
    {label: "4 Seats", value: "4"},
    {label: "5 Seats", value: "5"}
    // {label: "5+ Seats", value: "5+"}
  ];
  vehicleYears = [];
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
  vehiclePhotos:any;
  // vehicleIdPhotos: any;
  imageSrc1: string | ArrayBuffer;
  imageSrc2: string | ArrayBuffer;
  imageSrc3: string | ArrayBuffer;
  imageSrc4: string | ArrayBuffer;
  errorMessage1 : string;
  errorMessage2 : string;
  errorMessage3 : string;
  errorMessage4 : string;
  profilePhotoUrl: string;
  defaultPic: string;

  constructor(
    config: NgbDatepickerConfig,
    private validation: Validation,
    private driverService: DriverService,
    private toastyService: ToastyService,
    private router: Router,
    private fileValidator: FileValidator,
    private route:ActivatedRoute
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
    };
}

ngOnInit() {
    var year = (new Date()).getFullYear();
    for(var i=year-30;i<=year;i++){
      this.vehicleYears.push({label:i.toString(),value:i.toString()});
    }
    this.route.params.subscribe((params:Params) => {
        this.vehicle_id = params['vehicle_id'];
        this.editMode = params['vehicle_id']!=null;
    });
    this.profilePhotoUrl = environment.profileImageUrl;
    this.defaultPic = this.profilePhotoUrl + 'default.png';
    this.vehicleForm = new FormGroup({
      typeId: new FormControl("", [Validators.required]),
      year: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(5),
        Validators.pattern(this.validation.integer),
      ]),
      seats: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2),
        Validators.pattern(this.validation.integer),
      ]),
      color: new FormControl("", [Validators.required]),
      model: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
      ]),
      platNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
      ]),
      isAcAvailable: new FormControl(true, []),
      isSmokingAllowed: new FormControl(false, []),
      idPhotos1: new FormControl("", []),
      idPhotos2: new FormControl("", []),
      vehicleIdPhotos1: new FormControl("", []),
      vehicleIdPhotos2: new FormControl("", []),
    });
    this.vehicleForm.patchValue({
      year:year.toString()
    });
    this.getAllVehicleTypes();
    if(this.editMode){
      this.getVehicleDetails();
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
        this.vehicleForm.patchValue({
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
          return { label: vehicleColor.name.en, value: vehicleColor.name.en };
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
  getVehicleDetails(){
    var vehicles = JSON.parse(localStorage.getItem("VoVehicleList"));
    if(!vehicles){
      this.router.navigate(["/vehicle-owner-management"]);
      return;
    }
    console.log(vehicles);
    var vehicle;
    for(var i of vehicles){
        if(i._id === this.vehicle_id){
            vehicle = i;
            break;
          }
        }
    console.log(vehicle);
    if(!vehicle){
        this.router.navigate(["/vehicle-owner-management"]);
        return;
    }
    this.imageSrc1 = vehicle.vehicleIdPhotos ? environment.vehicleImageUrl + vehicle.vehicleIdPhotos[0]:this.imageSrc1;
    this.imageSrc2 = vehicle.vehicleIdPhotos ? environment.vehicleImageUrl + vehicle.vehicleIdPhotos[1]:this.imageSrc2;
    this.imageSrc3 = vehicle.vehiclePhotos ? environment.vehicleImageUrl + vehicle.vehiclePhotos[0]:this.imageSrc3;
    this.imageSrc4 = vehicle.vehiclePhotos ? environment.vehicleImageUrl + vehicle.vehiclePhotos[1]:this.imageSrc4;
    this.vehicleForm.setValue({
        typeId: vehicle.typeId,
        year: vehicle.year,
        seats: vehicle.seats,
        color: vehicle.color,
        model: vehicle.model,
        platNumber: vehicle.platNumber,
        isAcAvailable: vehicle.isAcAvailable,
        isSmokingAllowed: vehicle.isSmokingAllowed,
        idPhotos1: "",
        idPhotos2: "",
        vehicleIdPhotos1: "",
        vehicleIdPhotos2: "", 
    });
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
    if (e.target.files.length > 0 && e.target.files[0]) {
      this.isProfileSelected = true;
      let file = e.target.files[0];
      if (file) {
        if (!this.fileValidator.validateImage(file.name)) {
          this.isProfileExtensionError = true;
        } else {
          this.isProfileExtensionError = false;
          const reader = new FileReader();
          reader.onload = (e) => (this.imageSrc = reader.result);

          reader.readAsDataURL(file);
        }
        this.profilePhoto = file;
      }
    }
    else {
      this.profilePhoto = "";
      this.isProfileSelected = false;
      this.isProfileExtensionError = false;
    }
  }
  onIdImageChange1(e) {
    this.idPhotoImageArray1 = [];
    const vm = this;
    if(e.target.files[0].size <= 2048000){
      this.errorMessage2 = "";
    if (e.target.files.length > 0 && e.target.files[0]) {
      this.isIdPhotosSelected1 = true;
      let file = e.target.files[0];
      let filesLength = e.target.files.length;
      let files = e.target.files;
      for (let i = 0; i < filesLength; i++) {
        if (!this.fileValidator.validateImage(files[i].name)) {
          this.isIdPhotosExtensionError1 = true;
        } else {
          this.isIdPhotosExtensionError1 = false;
          let reader = new FileReader();
          // reader.onload = (e: any) => {
          //   var image = new Image();
          //   image.src = e.target.result;
          // };
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
    } else {
      this.idPhotoImageArray1 = [];
      this.idPhotoImageLengthError1 = true;
      this.isIdPhotosSelected1 = false;
      this.isIdPhotosExtensionError1 = false;
    }
  } else {
    this.errorMessage2 = "Image should be less than 2mb";
  }
  }
  onIdImageChange(e) {
    this.idPhotoImageArray = [];
    const vm = this;
    if(e.target.files[0].size <= 2048000){
      this.errorMessage1 = "";
    if (e.target.files.length > 0 && e.target.files[0]) {
      this.isIdPhotosSelected = true;
      let filesLength = e.target.files.length;
      let file = e.target.files[0];
      let files = e.target.files;
      for (let i = 0; i < filesLength; i++) {
        if (!this.fileValidator.validateImage(files[i].name)) {
          this.isIdPhotosExtensionError = true;
        } else {
          this.isIdPhotosExtensionError = false;
          let reader = new FileReader();
          // reader.onload = (e: any) => {
          //   var image = new Image();
          //   image.src = e.target.result;
          reader.onload = (e) => (this.imageSrc1 = reader.result);
          reader.readAsDataURL(file);
          // };
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
      this.idPhotoImageArray = [];
      this.idPhotoImageLengthError = true;
      this.isIdPhotosSelected = false;
      this.isIdPhotosExtensionError = false;
    }
  } else {
    this.errorMessage1 = "Image should be less than 2mb";
  }
  }
  onVehicleIdImageChange(e) {
    this.vehicleIdPhotoImageArray = [];
    const vm = this;
    if(e.target.files[0].size <= 2048000){
      this.errorMessage3 = "";
    if (e.target.files.length > 0 && e.target.files[0]) {
      this.isVehicleIdPhotosSelected = true;
      let file = e.target.files[0];
      let filesLength = e.target.files.length;
      let files = e.target.files;
      for (let i = 0; i < filesLength; i++) {
        if (!this.fileValidator.validateImage(files[i].name)) {
          this.isVehicleIdPhotosExtensionError = true;
        } else {
          this.isVehicleIdPhotosExtensionError = false;
          let reader = new FileReader();
          // reader.onload = (e: any) => {
          //   var image = new Image();
          //   image.src = e.target.result;
          // };
          reader.onload = (e) => (this.imageSrc3 = reader.result);
          reader.readAsDataURL(file);
          this.vehicleIdPhotoImageArray.push(files[i]);
        }
        if (
          this.vehicleIdPhotoImageArray.length < 1 ||
          this.vehicleIdPhotoImageArray.length > 2
        ) {
          this.vehicleIdPhotoImageLengthError = true;
        } else {
          this.vehicleIdPhotoImageLengthError = false;
        }
      }
    } else {
      this.vehicleIdPhotoImageArray = [];
      this.vehicleIdPhotoImageLengthError = true;
      this.isVehicleIdPhotosSelected = false;
      this.isVehicleIdPhotosExtensionError = false;
    }
  } else {
    this.errorMessage3 = "Image should be less than 2mb";
  }
  }
  onVehicleIdImageChange1(e) {
    this.vehicleIdPhotoImageArray1 = [];
    const vm = this;
    if(e.target.files[0].size <= 2048000){
      this.errorMessage4 = "";
    if (e.target.files.length > 0 && e.target.files[0]) {
      this.isVehicleIdPhotosSelected1 = true;
      let filesLength = e.target.files.length;
      let files = e.target.files;
      let file = e.target.files[0];
      for (let i = 0; i < filesLength; i++) {
        if (!this.fileValidator.validateImage(files[i].name)) {
          this.isVehicleIdPhotosExtensionError1 = true;
        } else {
          this.isVehicleIdPhotosExtensionError1 = false;
          let reader = new FileReader();
          // reader.onload = (e: any) => {
          //   this.imageSrc1 = reader.result;
          //   var image = new Image();
          //   image.src = e.target.result;
          //   reader.readAsDataURL(file);
          // };
          reader.onload = (e) => (this.imageSrc4 = reader.result);
          reader.readAsDataURL(file);
          this.vehicleIdPhotoImageArray1.push(files[i]);
        }
        if (
          this.vehicleIdPhotoImageArray1.length < 1 ||
          this.vehicleIdPhotoImageArray1.length > 2
        ) {
          this.vehicleIdPhotoImageLengthError1 = true;
        } else {
          this.vehicleIdPhotoImageLengthError1 = false;
        }
      }
    } else {
      this.vehicleIdPhotoImageArray1 = [];
      this.vehicleIdPhotoImageLengthError1 = true;
      this.isVehicleIdPhotosSelected1 = false;
      this.isVehicleIdPhotosExtensionError1 = false;
    }
  } else {
    this.errorMessage4 = "Image should be less than 2mb";
  }
  }

  onChangeMobileNumber() {
    let firstDigit = this.vehicleForm.value.phoneNumber.slice(0, 1);
    if (firstDigit == 0) {
      this.vehicleForm.value.phoneNumber = this.vehicleForm.value.phoneNumber.slice(
        1,
        this.vehicleForm.value.phoneNumber.length
      );
      this.vehicleForm.patchValue({
        phoneNumber: this.vehicleForm.value.phoneNumber,
      });
    }
  }
  onChangeUplinecode() {
    let firstDigit = this.vehicleForm.value.uplineCode.slice(0, 1);
    if (firstDigit == 0) {
      this.vehicleForm.value.uplineCode = this.vehicleForm.value.uplineCode.slice(
        1,
        this.vehicleForm.value.uplineCode.length
      );
      this.vehicleForm.patchValue({
        uplineCode: this.vehicleForm.value.uplineCode,
      });
    }
  }
  onFormSubmit() {
    this.isSubmitted = true;
    if (
      this.vehicleForm.valid && ( this.editMode ||
      this.isVehicleIdPhotosSelected) &&
      !this.isVehicleIdPhotosExtensionError &&
      !this.vehicleIdPhotoImageLengthError
    ) {
      this.loading = true;
      let params = this.vehicleForm.value;
      let formData: FormData = new FormData();
      for (let key in params) {
        formData.append(key, params[key]);
      }
      let x = [params["idPhotos1"], params["idPhotos2"]];

      if (this.isProfileSelected) {
        formData.append("profilePhoto", this.profilePhoto);
      }
      if(this.isIdPhotosSelected) {
        formData.append("vehiclePhotos",this.idPhotos1 );
      }
      if (this.isIdPhotosSelected) {
        formData.append(
          "vehicleIdPhotos",
          this.idPhotoImageArray[0],
          this.idPhotoImageArray[0].name
        );
        formData.append(
          "vehicleIdPhotos",
          this.idPhotoImageArray1[0],
          this.idPhotoImageArray1[0].name
        );
      }
      if (this.isVehicleIdPhotosSelected) {
        formData.append(
          "vehiclePhotos",
          this.vehicleIdPhotoImageArray[0],
          this.vehicleIdPhotoImageArray[0].name
        );
        formData.append(
          "vehiclePhotos",
          this.vehicleIdPhotoImageArray1[0],
          this.vehicleIdPhotoImageArray1[0].name
        );
      }
      if(this.editMode){
        formData.append("vehicleId",this.vehicle_id);
      }
        this.driverService.vehicle(formData,this.editMode).subscribe(
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
            this.router.navigate(["/vehicle-owner-management"]);
            } else {
                this.addToast({
                    title: "Error",
                    msg: this.editMode?"Vehicle Updated successfully":next.message,
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
