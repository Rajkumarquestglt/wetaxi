import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Validation } from "../../helper/validation";
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FileValidator } from "../../helper/file-input.validator";
import { VehicleService } from "../../services";
import { environment } from "src/environments/environment";
@Component({
  selector: "vehicle",
  templateUrl: "./vehicle.component.html"
}) 
export class VehicleComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  vehicleForm: FormGroup;
  isSubmitted: boolean = false;
  isImageExtensionError: Boolean = false;
  isImageSelected: Boolean = false;
  image: any = {};
  imageSrc: string | ArrayBuffer;
  editMode = false;
  vehicle_id !:string;
  vehicleData: any;
  errorMessageName: string;
  errorMessageImage:string;

  constructor(
    private validation: Validation,
    private vehicleService: VehicleService,
    private toastyService: ToastyService,
    private router: Router,
    private fileValidator: FileValidator,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
        this.vehicle_id = params['vehicle_id'];
        this.editMode = params['vehicle_id']!=null;
        // this.vehicleService.deleteVehicleType({vehicle_id:this.vehicle_id}).subscribe(response => {
        //   console.log(response);
        // });
    });
    this.vehicleForm = new FormGroup({
      name_en: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      minFare: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        Validators.pattern(this.validation.integer)
      ]),
      feePerKM: new FormControl("", [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(5),
        Validators.pattern(this.validation.integer)
      ]),
       image: new FormControl("", [])
    });
    if(this.editMode){
      // document.getElementById('editvehicle').remove();
      this.vehicleForm.removeControl('minFare');
      this.vehicleForm.removeControl('feePerKM');
      this.getVehicleDetails();
    }
  }

  getVehicleDetails() {
    this.loading = true;
    let vehicleData = {
      'vehicle_id': this.vehicle_id
    }
    this.vehicleService.getVehicleDetails(vehicleData).subscribe(
      respone => {
        this.loading = false;
        this.vehicleData = respone.data;
        this.imageSrc = environment.vehicleTypeImageUrl+this.vehicleData.image;
        this.vehicleForm.setValue({
          name_en: this.vehicleData.type.en,
          image: ''
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

  onImageChange(e) {
    this.errorMessageImage = "";
    if(e.target.files[0].size <= 2048000){
    const vm = this;
    if (e.target.files.length > 0) {
      this.isImageSelected = true;
      let file = e.target.files[0];
      if (file) {
        if (!this.fileValidator.validateImage(file.name)) {
          this.isImageExtensionError = true;
        } else {
          this.isImageExtensionError = false;
  
          const reader = new FileReader();
          reader.onload = (e) => (this.imageSrc = reader.result);

          reader.readAsDataURL(file);
          this.image = file;
        }
      }
    } else {
      this.image = "";
      this.isImageSelected = false;
      this.isImageExtensionError = false;
    }
    }
    else {
      this.errorMessageImage = "Size Must be less than 2mb.";
    }
  }
  handleValidationName(e) {
    this.errorMessageName = "";
    if(e.target.classList.contains('ng-touched') && e.target.value === ""){
      this.errorMessageName = "Please enter name.";
    } else if(this.vehicleForm.hasError('pattern', 'name_en')){
      this.errorMessageName = "Please enter name in english.";
    } else if(e.target.value.length<2 || 50<e.target.value.length){
      this.errorMessageName = "Name must be 2 to 50 characters long.";
    }
  }
  onFormSubmit() {
    this.isSubmitted = true;

    if (this.vehicleForm.valid && !this.isImageExtensionError && (this.isImageSelected || this.editMode)) {
      this.loading = true;
      let formData: FormData = new FormData();
      let type:any = {};
      type.en = this.vehicleForm.value.name_en;

      console.log("this.vehicleForm.value.name_en",this.vehicleForm.value.name_en)
      formData.append('type', JSON.stringify(type));

      delete this.vehicleForm.value.name_en;
      delete this.vehicleForm.value.image;

      this.vehicleForm.value.vehicle_id = this.vehicle_id;
      let params = this.vehicleForm.value;
      for (let key in params) {
          formData.append(key, params[key]);
      }
      console.log("this.isImageSelected",this.isImageSelected)

      if(this.isImageSelected) {
        formData.append("image", this.image);
      }
      
      console.log("formData",formData)
      if(this.editMode){
        this.vehicleService.editVehicleType(formData)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/vehicle/"]);
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
      this.vehicleService.addVehicleType(formData)
      
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            console.log("ok111",next)
      console.log("formData",formData)

            if (next.status_code == 200) { 
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/vehicle/"]);
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
